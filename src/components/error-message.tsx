export function ErrorMessage({ error }: { error: unknown }) {
    if (error === undefined || error === null) return null;
    return <p role="alert">{error instanceof Error ? error.message : String(error)}</p>;
}
