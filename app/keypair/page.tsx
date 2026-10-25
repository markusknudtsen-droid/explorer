'use client';

import { Keypair } from '@solana/web3.js';
import React from 'react';

export default function KeypairPage() {
    const [keypair, setKeypair] = React.useState<Keypair | null>(null);
    const [showPrivateKey, setShowPrivateKey] = React.useState(false);

    const generateKeypair = React.useCallback(() => {
        setShowPrivateKey(false);
        setKeypair(Keypair.generate());
    }, []);

    const downloadKeypair = React.useCallback(() => {
        if (!keypair) return;
        const secretKeyArray = Array.from(keypair.secretKey);
        const blob = new Blob([JSON.stringify(secretKeyArray)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keypair.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [keypair]);

    const secretKeyJson = React.useMemo(() => {
        if (!keypair) return null;
        // Show as JSON array (Solana CLI format)
        return JSON.stringify(Array.from(keypair.secretKey));
    }, [keypair]);

    return (
        <div className="container mt-4">
            <div className="header">
                <div className="header-body">
                    <h2 className="header-title">Keypair Generator</h2>
                    <p className="header-subtitle text-muted">
                        Generate a new Solana keypair in your browser — equivalent to{' '}
                        <code>solana-keygen new</code>.
                    </p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="alert alert-warning" role="alert">
                        <strong>Security notice:</strong> Keys are generated locally in your browser and are never
                        transmitted. However, browser-based key generation is not recommended for high-value wallets.
                        Use the{' '}
                        <a
                            href="https://docs.solanalabs.com/cli/wallets/paper"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Solana CLI
                        </a>{' '}
                        for production use.
                    </div>

                    <button className="btn btn-primary" onClick={generateKeypair}>
                        Generate New Keypair
                    </button>
                </div>
            </div>

            {keypair && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-header-title">Generated Keypair</h3>
                        <button className="btn btn-sm btn-white" onClick={downloadKeypair}>
                            Download keypair.json
                        </button>
                    </div>
                    <div className="card-body">
                        <table className="table table-sm table-nowrap mb-0">
                            <tbody>
                                <tr>
                                    <td className="text-muted" style={{ width: '160px' }}>
                                        Public Key
                                    </td>
                                    <td>
                                        <code className="font-monospace">
                                            {keypair.publicKey.toBase58()}
                                        </code>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-muted">Secret Key</td>
                                    <td>
                                        {showPrivateKey ? (
                                            <div className="d-flex align-items-start gap-2">
                                                <code
                                                    className="font-monospace text-break"
                                                    style={{ wordBreak: 'break-all' }}
                                                >
                                                    {secretKeyJson}
                                                </code>
                                                <button
                                                    className="btn btn-sm btn-white flex-shrink-0"
                                                    onClick={() => setShowPrivateKey(false)}
                                                >
                                                    Hide
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-white"
                                                onClick={() => setShowPrivateKey(true)}
                                            >
                                                Reveal
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
