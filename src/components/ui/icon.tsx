import { SVGProps } from "react";
import { siGithub, siGithubsponsors, siGoogleplay, siInstagram, SimpleIcon, siX, siYoutube } from "simple-icons";

export function createIcon(icon: SimpleIcon) {
    return function Icon(props: SVGProps<SVGSVGElement>) {
        return (
            <svg
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                width={24}
                height={24}
                stroke="none"
                {...props}
            >
                <path d={icon.path} />
            </svg>
        );
    };
}

export const Icons = {
    Github: createIcon(siGithub),
    X: createIcon(siX),
    GithubSponsors: createIcon(siGithubsponsors),
    Instagram: createIcon(siInstagram),
    YouTube: createIcon(siYoutube),
    GooglePlay: createIcon(siGoogleplay),
};
