type HomeProps = {
    headline: string;
    cta: { label: string; url: string };
};

export default function Home({ headline, cta }: HomeProps) {
    console.log({ headline, cta });

    return (
        <div>
            <h1>{headline}</h1>
            <a href={cta.url}>{cta.label}</a>
        </div>
    );
}
