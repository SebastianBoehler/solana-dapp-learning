import Link from 'next/link';
import { ErrorMessage } from './error-message';

interface Status {
    isRunning: boolean;
    error: unknown;
    data: string | undefined;
}

export function TransactionStatus({ action }: { action: Status }) {
    return <div aria-live="polite" className="space-y-2">
        {action.isRunning && <p>Waiting for wallet approval and transaction confirmation…</p>}
        <ErrorMessage error={action.error} />
        {action.data && <Link className="underline break-all" href={`https://explorer.solana.com/tx/${action.data}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
            View confirmed transaction
        </Link>}
    </div>;
}
