import { Link } from '@inertiajs/react';

type HomeProps = {
    headline: string;
    cta: { label: string; url: string };
};

export default function Home({ headline, cta }: Readonly<HomeProps>) {
    return (
        <div>
            <h1>{headline}</h1>
            <Link href={cta.url}>{cta.label}</Link>
        </div>
    );
}
