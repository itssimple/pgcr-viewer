import { useEffect, useState } from "preact/hooks";

export function Destiny2PGCR(props: { pgcrId: string }) {
    const { pgcrId } = props;

    const [pgcrData, setPgcrData] = useState<any>(null);
    const [pgcrPeriod, setPgcrPeriod] = useState<any>(null);
    const [pgcrActivity, setPgcrActivity] = useState<any>(null);
    const [pgcrActivityType, setPgcrActivityType] = useState<any>(null);
    const [pgcrActivityMode, setPgcrActivityMode] = useState<any>(null);

    useEffect(() => {
        async function fetchPGCR() {
            const resp = await fetch(
                `https://stats.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/${pgcrId}/?_cache=${new Date().getTime()}`,
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
            const data = pgcr.Response;

            setPgcrPeriod(data.period);

            if (data.activityDetails) {
                const activityDetails = data.activityDetails;

                const activityResp = await fetch(
                    `https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/${
                        activityDetails.referenceId
                    }/?_cache=${new Date().getTime()}`,
                    {
                        method: "GET",
                        headers: {
                            "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const activityData = await activityResp.json();
                setPgcrActivity(activityData);

                const activityTypeResp = await fetch(
                    `https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityTypeDefinition/${
                        activityData.Response.activityTypeHash
                    }/?_cache=${new Date().getTime()}`,
                    {
                        method: "GET",
                        headers: {
                            "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const activityTypeData = await activityTypeResp.json();
                setPgcrActivityType(activityTypeData);

                const activityModeResp = await fetch(
                    `https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityModeDefinition/${
                        activityData.Response.activityTypeHash
                    }/?_cache=${new Date().getTime()}`,
                    {
                        method: "GET",
                        headers: {
                            "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const activityModeData = await activityModeResp.json();
                setPgcrActivityMode(activityModeData);
            }

            if (data.teams && data.teams.length > 0) {
                console.log(data.teams);
            }
        }
    }

    return (
        <div>
            <h1 class="text-xl">Destiny 2 PGCR: {pgcrId}</h1>
            {pgcrData != null && (
                <>
                    <div
                        id="pgcr-data"
                        class="bg-gray-900 text-white p-0 rounded mt-5 mb-2 relative flex items-end content-end"
                    >
                        <div
                            class="top-0 left-0 right-0 bottom-0 bg-cover bg-no-repeat absolute max-h[none]"
                            style={
                                pgcrActivity &&
                                `background-image: url(https://www.bungie.net${pgcrActivity.Response.pgcrImage});`
                            }
                        ></div>
                        <div class="relative bg-linear-to-tr from-black/90 to-black/0 text-left p-5 w-full pt-25">
                            <div class="">
                                <div
                                    class="w-16 h-16 bg-cover bg-no-repeat"
                                    style={
                                        pgcrActivityMode &&
                                        `background-image: url(https://www.bungie.net${pgcrActivityMode.Response.displayProperties.icon});`
                                    }
                                ></div>
                            </div>
                            <div class="text-5xl font-bold">
                                {pgcrActivityType && (
                                    <>
                                        {
                                            pgcrActivityType.Response
                                                .displayProperties.name
                                        }
                                    </>
                                )}
                            </div>
                            <div class="text-3xl mt-2">
                                {pgcrActivity && (
                                    <>
                                        {
                                            pgcrActivity.Response
                                                .displayProperties.name
                                        }
                                    </>
                                )}
                            </div>
                            <em>
                                {pgcrActivity && (
                                    <>
                                        {
                                            pgcrActivity.Response
                                                .displayProperties.description
                                        }
                                    </>
                                )}
                            </em>
                            {pgcrPeriod && (
                                <p>
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
                        </div>
                    </div>
                    {pgcrData && pgcrData.Response.entries && (
                        <div>
                            {pgcrData.Response.entries.map(
                                (entry: any, index: number) => {
                                    const player = entry.player;
                                    const playerData =
                                        pgcrData.Response.entries[index];
                                    return (
                                        <div
                                            key={index}
                                            class="bg-gray-900 text-white p-2 rounded mt-2 mb-2 flex flex-col items-start"
                                        >
                                            <div class="text-2xl font-bold">
                                                {
                                                    player.destinyUserInfo
                                                        .bungieGlobalDisplayName
                                                }
                                                <span class="text-gray-400">
                                                    {"#"}
                                                    {
                                                        player.destinyUserInfo
                                                            .bungieGlobalDisplayNameCode
                                                    }
                                                </span>{" "}
                                                (
                                                {player.characterClass ? (
                                                    player.characterClass
                                                ) : (
                                                    <em>Unknown</em>
                                                )}
                                                , lvl. {player.characterLevel},
                                                light lvl. {player.lightLevel}){" "}
                                                <small>
                                                    <em>
                                                        duration:{" "}
                                                        {
                                                            playerData.values
                                                                .activityDurationSeconds
                                                                .basic
                                                                .displayValue
                                                        }
                                                    </em>
                                                </small>
                                            </div>
                                            <table class="table-auto w-full mt-2 mb-2">
                                                <thead class="text-xs text-gray-400 uppercase bg-gray-700">
                                                    <tr>
                                                        <th class="text-left px-6 py-3">
                                                            Stat
                                                        </th>
                                                        <th class="text-right px-6 py-3">
                                                            Value
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(
                                                        playerData.values
                                                    ).map(
                                                        (
                                                            [key, value]: [
                                                                string,
                                                                any
                                                            ],
                                                            index
                                                        ) => {
                                                            return (
                                                                <tr
                                                                    key={index}
                                                                    class="odd:bg-gray-900 even:bg-gray-800"
                                                                >
                                                                    <td class="text-left  px-6 py-3">
                                                                        {key}
                                                                    </td>
                                                                    <td class="text-right px-6 py-3">
                                                                        {
                                                                            value
                                                                                .basic
                                                                                .displayValue
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                    <tr class="text-xs text-gray-400 uppercase bg-gray-700">
                                                        <th class="text-left px-6 py-3">
                                                            Extended Stats
                                                        </th>
                                                        <th class="text-right px-6 py-3">
                                                            Value
                                                        </th>
                                                    </tr>
                                                    {Object.entries(
                                                        playerData.extended
                                                            .values
                                                    ).map(
                                                        (
                                                            [key, value]: [
                                                                string,
                                                                any
                                                            ],
                                                            index
                                                        ) => {
                                                            return (
                                                                <tr
                                                                    key={index}
                                                                    class="odd:bg-gray-900 even:bg-gray-800"
                                                                >
                                                                    <td class="text-left  px-6 py-3">
                                                                        {key}
                                                                    </td>
                                                                    <td class="text-right px-6 py-3">
                                                                        {
                                                                            value
                                                                                .basic
                                                                                .displayValue
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                    <div>
                        <pre class="bg-gray-900 text-white p-4 rounded text-left">
                            <code id="json" class="whitespace-pre-wrap">
                                {JSON.stringify(pgcrData, null, 2)}
                            </code>
                        </pre>
                    </div>
                </>
            )}
        </div>
    );
}
