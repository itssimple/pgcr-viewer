import { useEffect, useState } from "preact/hooks";
import { DestinyActivityModeType } from "../classes/bungieEnums";

export function Destiny2PGCR(props: { pgcrId: string }) {
    const { pgcrId } = props;

    const [loading, setLoading] = useState<boolean>(true);

    const [pgcrData, setPgcrData] = useState<any>(null);
    const [pgcrPeriod, setPgcrPeriod] = useState<any>(null);
    const [pgcrTeam, setPcgrTeam] = useState<any>(null);
    const [pgcrDirectorActivity, setPgcrDirectorActivity] = useState<any>(null);
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
            setLoading(false);
        }

        fetchPGCR();
    }, []);

    useEffect(() => {
        if (!loading && window.location.hash) {
            const hash = window.location.hash.replace("#", "");
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [loading, window.location.hash]);

    async function fetchPGCRData(pgcr: any) {
        if (pgcr != null) {
            const data = pgcr.Response;

            setPgcrPeriod(data.period);

            if (data.teams && data.teams.length > 0) {
                console.log("Teams found:", data.teams);
                setPcgrTeam(data.teams);
            }

            if (data.activityDetails) {
                const activityDetails = data.activityDetails;

                const pgcrDate = new Date(data.period);
                console.log("PGCR Date:", pgcrDate);

                console.log("PGCR Data:", data);

                const directorActivityResp = await fetch(
                    `https://manifest.report/definition/Activity/${activityDetails.directorActivityHash}/?includeHistory=true`,
                    {
                        method: "GET",
                        headers: {
                            "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const directorActivityData = await directorActivityResp.json();

                directorActivityData.latestVersion = directorActivityData.data;

                const directorActivityDataHistory =
                    directorActivityData.history;
                if (
                    directorActivityDataHistory &&
                    directorActivityDataHistory.length > 0
                ) {
                    let closestVersion = directorActivityDataHistory[0];
                    for (const version of directorActivityDataHistory) {
                        const versionDate = new Date(version.DiscoveredUTC);

                        if (versionDate <= pgcrDate) {
                            closestVersion = version;
                        }
                    }
                    directorActivityData.data = JSON.parse(
                        closestVersion.JSONContent
                    );
                    directorActivityData.selectedVersion = closestVersion;
                }

                console.log("Director Activity Data:", directorActivityData);

                setPgcrDirectorActivity(directorActivityData);

                const activityResp = await fetch(
                    `https://manifest.report/definition/Activity/${activityDetails.referenceId}/?includeHistory=true`,
                    {
                        method: "GET",
                        headers: {
                            "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const activityData = await activityResp.json();

                activityData.latestVersion = activityData.data;

                const activityDataHistory = activityData.history;
                if (activityDataHistory && activityDataHistory.length > 0) {
                    let closestVersion = activityDataHistory[0];
                    for (const version of activityDataHistory) {
                        const versionDate = new Date(version.DiscoveredUTC);

                        if (versionDate <= pgcrDate) {
                            closestVersion = version;
                        }
                    }
                    activityData.data = JSON.parse(closestVersion.JSONContent);
                    activityData.selectedVersion = closestVersion;
                }

                console.log("Activity Data:", activityData);

                setPgcrActivity(activityData);

                const activityTypeResp = await fetch(
                    `https://manifest.report/definition/ActivityType/${activityData.data.activityTypeHash}/?includeHistory=true`,
                    {
                        method: "GET",
                        headers: {
                            "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const activityTypeData = await activityTypeResp.json();

                activityTypeData.latestVersion = activityTypeData.data;

                const activityTypeDataHistory = activityTypeData.history;
                if (
                    activityTypeDataHistory &&
                    activityTypeDataHistory.length > 0
                ) {
                    let closestVersion = activityTypeDataHistory[0];
                    for (const version of activityTypeDataHistory) {
                        const versionDate = new Date(version.DiscoveredUTC);

                        if (versionDate <= pgcrDate) {
                            closestVersion = version;
                        }
                    }

                    activityTypeData.data = JSON.parse(
                        closestVersion.JSONContent
                    );
                    activityTypeData.selectedVersion = closestVersion;
                }

                console.log("Activity Type Data:", activityTypeData);

                setPgcrActivityType(activityTypeData);

                let activityModeHash = activityData.data.activityTypeHash;

                if (
                    activityData.data.activityModeHashes &&
                    activityData.data.activityModeHashes.length > 0
                ) {
                    activityModeHash = activityData.data.activityModeHashes[0];
                }

                const activityModeResp = await fetch(
                    `https://manifest.report/definition/ActivityMode/${activityModeHash}/?includeHistory=true`,
                    {
                        method: "GET",
                        headers: {
                            "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (activityModeResp.status !== 404) {
                    const activityModeData = await activityModeResp.json();

                    activityModeData.latestVersion = activityModeData.data;

                    const activityModeDataHistory = activityModeData.history;
                    if (
                        activityModeDataHistory &&
                        activityModeDataHistory.length > 0
                    ) {
                        let closestVersion = activityModeDataHistory[0];
                        for (const version of activityModeDataHistory) {
                            const versionDate = new Date(version.DiscoveredUTC);

                            if (versionDate <= pgcrDate) {
                                closestVersion = version;
                            }
                        }
                        console.log("Closest Version:", closestVersion);
                        activityModeData.data = JSON.parse(
                            closestVersion.JSONContent
                        );
                        activityModeData.selectedVersion = closestVersion;
                    }

                    console.log("Activity Mode Data:", activityModeData);

                    setPgcrActivityMode(activityModeData);
                }
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
                                `background-image: url(https://storage.manifest.report/manifest-archive/images${pgcrActivity.data.pgcrImage});`
                            }
                        ></div>
                        <div class="relative bg-linear-to-tr from-black/90 to-black/0 text-left p-5 w-full pt-25">
                            <div class="">
                                <div
                                    class="w-16 h-16 bg-cover bg-no-repeat"
                                    style={
                                        pgcrActivityMode &&
                                        pgcrActivityMode.data &&
                                        pgcrActivityMode.data
                                            .displayProperties &&
                                        `background-image: url(https://storage.manifest.report/manifest-archive/images${pgcrActivityMode.data.displayProperties.icon});`
                                    }
                                ></div>
                            </div>
                            <div class="text-5xl font-bold">
                                {pgcrActivityType && (
                                    <>
                                        {
                                            pgcrActivityType.data
                                                .displayProperties.name
                                        }
                                    </>
                                )}
                                {DestinyActivityModeType[
                                    pgcrData.Response.activityDetails.mode
                                ] && (
                                    <>
                                        {" - "}
                                        {
                                            DestinyActivityModeType[
                                                pgcrData.Response
                                                    .activityDetails.mode
                                            ]
                                        }
                                    </>
                                )}
                            </div>
                            <div class="text-3xl mt-2">
                                {pgcrActivity && (
                                    <>
                                        {
                                            pgcrActivity.data.displayProperties
                                                .name
                                        }
                                    </>
                                )}
                            </div>
                            <em>
                                {pgcrActivity && (
                                    <>
                                        {
                                            pgcrActivity.data.displayProperties
                                                .description
                                        }
                                    </>
                                )}
                            </em>
                            {pgcrActivity &&
                                pgcrDirectorActivity &&
                                pgcrActivity.data.displayProperties.name !==
                                    pgcrDirectorActivity.data.displayProperties
                                        .name && (
                                    <>
                                        <div class="text-3xl">
                                            {pgcrDirectorActivity && (
                                                <>
                                                    {
                                                        pgcrDirectorActivity
                                                            .data
                                                            .displayProperties
                                                            .name
                                                    }
                                                </>
                                            )}
                                        </div>
                                        <em>
                                            {pgcrDirectorActivity && (
                                                <>
                                                    {
                                                        pgcrDirectorActivity
                                                            .data
                                                            .displayProperties
                                                            .description
                                                    }
                                                </>
                                            )}
                                        </em>
                                    </>
                                )}
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
                            {pgcrTeam && pgcrTeam.length > 0 && (
                                <div class="bg-gray-800 text-white p-4 rounded mt-2 mb-2">
                                    <h2 class="text-2xl font-bold mb-2">
                                        Teams (WIP)
                                    </h2>
                                    <table class="table-auto w-full">
                                        <thead class="text-xs text-gray-400 uppercase bg-gray-700">
                                            <tr>
                                                <th class="text-left px-6 py-3">
                                                    Team
                                                </th>
                                                <th
                                                    class="text-right
                                                        px-6 py-3"
                                                >
                                                    Score
                                                </th>
                                                <th
                                                    class="text-right
                                                            px-6 py-3"
                                                >
                                                    Standing
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pgcrTeam.map(
                                                (team: any, index: number) => {
                                                    return (
                                                        <tr
                                                            key={index}
                                                            class="odd:bg-gray-900 even:bg-gray-800"
                                                        >
                                                            <td class="text-left px-6 py-3">
                                                                {team.teamName ||
                                                                    `Team ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                            </td>
                                                            <td class="text-right px-6 py-3">
                                                                {
                                                                    team.score
                                                                        .basic
                                                                        .displayValue
                                                                }
                                                            </td>
                                                            <td class="text-right px-6 py-3">
                                                                {
                                                                    team
                                                                        .standing
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
                            )}
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
                                            <div
                                                class="text-2xl font-bold"
                                                id={`${player.destinyUserInfo.membershipId}`}
                                            >
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
