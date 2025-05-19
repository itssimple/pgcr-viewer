import projectLogo from "../assets/project-logo.png";

export function Home() {
    return (
        <div>
            <div>
                <img src={projectLogo} class="logo" alt="PGCR Viewer logo" />
            </div>

            <p>This is a simple viewer for Destiny 1/2 PGCRs.</p>
            <p>To view a PGCR for a specific activity, use the URL format:</p>
            <div class={"bg-gray-900 text-gray-200 p-2 rounded-md mb-2 mt-2"}>
                <code>https://pgcr.eververse.trade/destiny1/{`<pgcrId>`}</code>
            </div>
            <div class={"bg-gray-900 text-gray-200 p-2 rounded-md"}>
                <code>https://pgcr.eververse.trade/destiny2/{`<pgcrId>`}</code>
            </div>
        </div>
    );
}
