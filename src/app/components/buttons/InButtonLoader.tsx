import { ChildrenProp } from "@/types/ReacetHelpers";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
	isLoading: boolean;
	size?: SizeProp;
}

export default function InButtonLoader({ isLoading, children, size }: Props & ChildrenProp) {
	if (!isLoading)
		return children;
	return <FontAwesomeIcon icon={faSpinner} spinPulse size={size} />;

}
