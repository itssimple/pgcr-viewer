import { useEffect, useState } from "preact/hooks";

export function Destiny1PGCR(props: { pgcrId: string }) {
    const { pgcrId } = props;

    const [pgcrData, setPgcrData] = useState<any>(null);
    const [pgcrPeriod, setPgcrPeriod] = useState<any>(null);
    const [pgcrActivityType, setPgcrActivityType] = useState<any>(null);

    useEffect(() => {
        async function fetchPGCR() {
            const resp = await fetch(
                `https://stats.bungie.net/d1/platform/Destiny/Stats/PostGameCarnageReport/${pgcrId}/?_cache=${new Date().getTime()}`,
                {
                    method: "GET",
                    headers: {
                        "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await resp.json();
            setPgcrData(data);

            await fetchPGCRData(data);
        }

        fetchPGCR();
    }, []);

    async function fetchPGCRData(pgcr: any) {
        if (pgcr != null) {
            const responseData = pgcr.Response;

            if (responseData && responseData.data) {
                const data = responseData.data;

                setPgcrPeriod(data.period);

                if (data.activityDetails) {
                    const activityDetails = data.activityDetails;

                    const activityTypeResp = await fetch(
                        `https://www.bungie.net/d1/Platform/Destiny/Manifest/ActivityType/${
                            activityDetails.activityTypeHashOverride
                        }/?_cache=${new Date().getTime()}`,
                        {
                            method: "GET",
                            headers: {
                                "X-API-Key": import.meta.env
                                    .VITE_BUNGIE_API_KEY,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    const activityTypeData = await activityTypeResp.json();
                    setPgcrActivityType(activityTypeData);
                }

                if (data.entries) {
                }

                if (data.teams) {
                }
            }
        }
    }

    return (
        <div>
            <h1 class="text-xl">Destiny 1 PGCR: {pgcrId}</h1>
            {pgcrData != null && (
                <>
                    <div class="bg-gray-900 text-white p-4 rounded mt-5 mb-2">
                        <h2 class="text-xl">
                            {pgcrActivityType && (
                                <>
                                    {
                                        pgcrActivityType.Response.data
                                            .activityType.activityTypeName
                                    }
                                </>
                            )}
                        </h2>
                        <em>
                            {pgcrActivityType && (
                                <>
                                    {
                                        pgcrActivityType.Response.data
                                            .activityType
                                            .activityTypeDescription
                                    }
                                </>
                            )}
                        </em>
                        {pgcrPeriod && (
                            <p>
                                Timestamp:{" "}
                                {new Date(pgcrPeriod).toLocaleDateString(
                                    "sv-SE",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }
                                )}
                            </p>
                        )}
                        <p>
                            Activity ID:{" "}
                            {pgcrData.Response.data.activityDetails.instanceId}
                        </p>
                        <p>
                            Activity Type:{" "}
                            {
                                pgcrData.Response.data.activityDetails
                                    .activityTypeHashOverride
                            }
                        </p>
                        <p>
                            Activity Mode:{" "}
                            {pgcrData.Response.data.activityDetails.mode}
                        </p>
                    </div>
                </>
            )}
            <pre class="bg-gray-900 text-white p-4 rounded text-left">
                <code id="json" class="whitespace-pre-wrap">
                    {pgcrData == null
                        ? "Loading PGCR data"
                        : JSON.stringify(pgcrData, null, 2)}
                </code>
            </pre>
        </div>
    );
}
