import { useState, useEffect } from "react";
import { apiGet } from "../api";

const EMPTY = {
    org: null,
    app: null,
    infra: null,
    stagingServers: null,
    productionServers: null,
    checklist: null,
};

export async function fetchFormData(ids) {
    const wrap = (promise) => (promise ? promise : Promise.resolve(null));

    const results = await Promise.allSettled([
        wrap(ids.orgId ? apiGet(`/org/${ids.orgId}`) : null),
        wrap(ids.appId ? apiGet(`/apps/${ids.appId}`) : null),
        wrap(ids.infraId ? apiGet(`/infra/${ids.infraId}`) : null),
        wrap(ids.infraId ? apiGet(`/infra/${ids.infraId}/servers?environment=staging`) : null),
        wrap(ids.infraId ? apiGet(`/infra/${ids.infraId}/servers?environment=production`) : null),
        wrap(ids.checklistId ? apiGet(`/checklist/${ids.checklistId}`) : null),
    ]);

    const val = (r) => (r.status === "fulfilled" ? r.value : null);
    const [orgR, appR, infraR, stagingR, productionR, checklistR] = results;

    results.forEach((r) => {
        if (r.status === "rejected") console.error("Preview load error:", r.reason);
    });

    return {
        data: {
            org: val(orgR),
            app: val(appR),
            infra: val(infraR),
            stagingServers: val(stagingR),
            productionServers: val(productionR),
            checklist: val(checklistR),
        },
        failed: results.some((r) => r.status === "rejected"),
    };
}

export default function usePreviewData(ids) {
    const [data, setData] = useState(EMPTY);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadAll() {
            setError("");
            const res = await fetchFormData(ids);
            if (cancelled) return;

            setData(res.data);
            if (res.failed) {
                setError("Some sections could not be loaded and are not shown below. Please check the browser console or go back and verify each step.");
            }
            setLoaded(true);
        }

        loadAll();
        return () => { cancelled = true; };
    }, [ids.orgId, ids.appId, ids.infraId, ids.checklistId]);

    return { ...data, error, setError, loaded };
}