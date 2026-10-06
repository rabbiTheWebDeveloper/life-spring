#!/usr/bin/env python3
"""Delete container image versions this repository no longer needs.

Kept unconditionally: release tags, and the pointers a deploy resolves
(staging, main, production, latest). Of the per-commit builds, the newest
KEEP_RECENT survive. Untagged versions are kept when a surviving tag's
manifest index references them -- an attestation or platform child is part of
its parent image, and deleting it breaks the tag that looks whole.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request

API = "https://api.github.com"
ORG, PACKAGE = os.environ["ORG"], os.environ["PACKAGE"]
TOKEN = os.environ["TOKEN"]
KEEP_RECENT = int(os.environ.get("KEEP_RECENT", "10"))
DRY_RUN = os.environ.get("DRY_RUN", "false").lower() == "true"

PROTECTED = re.compile(r"^(v?\d+(\.\d+){1,2}|staging|main|production|latest)$")
MANIFEST_TYPES = ",".join([
    "application/vnd.oci.image.index.v1+json",
    "application/vnd.docker.distribution.manifest.list.v2+json",
    "application/vnd.oci.image.manifest.v1+json",
    "application/vnd.docker.distribution.manifest.v2+json",
])


def api(path, method="GET"):
    req = urllib.request.Request(
        API + path, method=method,
        headers={"Authorization": f"Bearer {TOKEN}",
                 "Accept": "application/vnd.github+json",
                 "X-GitHub-Api-Version": "2022-11-28"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as err:
        return err.code, err.read()


def versions():
    out, page = [], 1
    while True:
        status, body = api(f"/orgs/{ORG}/packages/container/{PACKAGE}"
                           f"/versions?per_page=100&page={page}")
        if status != 200:
            sys.exit(f"listing versions failed: {status} {body[:200].decode()}")
        chunk = json.loads(body)
        if not chunk:
            return out
        out += chunk
        page += 1


def registry_token():
    url = (f"https://ghcr.io/token?scope=repository:{ORG}/{PACKAGE}:pull"
           f"&service=ghcr.io")
    req = urllib.request.Request(url, headers={
        "Authorization": "Basic " + __import__("base64").b64encode(
            f"x:{TOKEN}".encode()).decode()})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)["token"]


def children(digest, rtok):
    """Digests an index references, so they are not deleted out from under it."""
    req = urllib.request.Request(
        f"https://ghcr.io/v2/{ORG}/{PACKAGE}/manifests/{digest}",
        headers={"Authorization": f"Bearer {rtok}", "Accept": MANIFEST_TYPES})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            man = json.load(resp)
    except Exception:
        return set()
    return {c["digest"] for c in man.get("manifests", [])}


def main():
    vers = versions()
    if not vers:
        print("no versions")
        return 0

    tagged, untagged = [], []
    for v in vers:
        (tagged if v["metadata"]["container"]["tags"] else untagged).append(v)

    keep_ids, protected, recent = set(), [], []
    for v in tagged:
        tags = v["metadata"]["container"]["tags"]
        (protected if any(PROTECTED.match(t) for t in tags) else recent).append(v)
    recent.sort(key=lambda v: v["created_at"], reverse=True)
    for v in protected + recent[:KEEP_RECENT]:
        keep_ids.add(v["id"])

    rtok = registry_token()
    referenced = set()
    for v in vers:
        if v["id"] in keep_ids:
            referenced |= children(v["name"], rtok)
    for v in untagged:
        if v["name"] in referenced:
            keep_ids.add(v["id"])

    drop = [v for v in vers if v["id"] not in keep_ids]
    print(f"{PACKAGE}: {len(vers)} versions, keep {len(keep_ids)}, drop {len(drop)}")

    failed = 0
    for v in drop:
        label = ",".join(v["metadata"]["container"]["tags"]) or v["name"][:19]
        if DRY_RUN:
            print(f"  would delete {label}")
            continue
        status, body = api(f"/orgs/{ORG}/packages/container/{PACKAGE}"
                           f"/versions/{v['id']}", method="DELETE")
        if status not in (204, 404):
            failed += 1
            print(f"  FAILED {label}: {status} {body[:120].decode()}")
    print(f"deleted {len(drop) - failed}, failed {failed}"
          if not DRY_RUN else f"dry run, would delete {len(drop)}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
