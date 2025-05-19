export function destiny1PGCR(props: { pgcrId: string }) {
    const { pgcrId } = props;

    var json = {};

    fetch(
        `https://stats.bungie.net/d1/platform/Destiny/Stats/PostGameCarnageReport/${pgcrId}/?_cache=${new Date().getTime()}`,
        {
            method: "GET",
            headers: {
                "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                "Content-Type": "application/json",
            },
        }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            json = data;
            document.getElementById("json")!.innerHTML = JSON.stringify(
                json,
                null,
                2
            );
        })
        .catch((error) => {
            console.error(
                "There was a problem with the fetch operation:",
                error
            );
        });

    return (
        <div>
            <h2>Destiny 1 PGCR: {pgcrId}</h2>
            <pre class="bg-gray-900 text-white p-4 rounded text-left">
                <code id="json" class="whitespace-pre-wrap">
                    Loading PGCR data
                </code>
            </pre>
        </div>
    );
}
