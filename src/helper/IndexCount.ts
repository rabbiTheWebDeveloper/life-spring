
export const indexCount = (index: number, page: number, size: number) => {
    return page * size + index + 1;
}
