interface VercelDeploymentResponse {
    url: string;
    readyState: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR';
    alias: string[];
}

export async function deployToVercel(
    repoUrl: string,
    projectName: string
): Promise<VercelDeploymentResponse> {
    // Extract owner/repo from GitHub URL
    const repoPath = repoUrl
        .replace('https://github.com/', '')
        .replace('.git', '');

    const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: projectName,
            gitSource: {
                repo: repoPath,
                type: 'github',
                ref: 'main' // or 'master' depending on your repo
            },
            target: 'production',
            // Optional: Add build settings if needed
            build: {
                env: {
                    NODE_ENV: 'production'
                }
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Vercel deployment failed');
    }

    return await response.json();
}
