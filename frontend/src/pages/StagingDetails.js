import { useState, useEffect } from "react";
import FormButtons from "../components/FormButtons";
import "./ServerDetails.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useFormContext } from "../context/FormContext";
import { apiGet, apiPost, apiPut } from "../api";


function emptyServer() {
    return { processor: "", ram: "", internal_storage: "", external_storage: "", external_storage_other: "", external_storage_capacity: "", os: "", os_other: "" };
}

function emptyDbServer() {
    return { ...emptyServer(), version: "" };
}

function validateServer(server) {
    const errs = {};
    if (!server.processor.trim()) errs.processor = "This field is required.";
    if (!server.ram.trim()) errs.ram = "This field is required.";
    if (!server.internal_storage.trim()) errs.internal_storage = "This field is required.";
    if (!server.external_storage) errs.external_storage = "This field is required.";
    if (server.external_storage === "Other" && !(server.external_storage_other || "").trim()) {
        errs.external_storage_other = "Please specify.";
    }
    if (!(server.external_storage_capacity || "").trim()) {
        errs.external_storage_capacity = "This field is required.";
    }
    if (!server.os) errs.os = "This field is required.";
    if (server.os === "Other" && !(server.os_other || "").trim()) {
        errs.os_other = "Please specify.";
    }
    if (server.version !== undefined && !server.version.trim()) errs.version = "This field is required.";
    return errs;
}

function StagingDetails() {
    const navigate = useNavigate();
    const { ids, setId } = useFormContext();

    const [webServers, setWebServers] = useState([]);
    const [appServers, setAppServers] = useState([]);
    const [dbServers, setDbServers] = useState([]);
    const [otherServers, setOtherServers] = useState([]);

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadExisting() {
            if (!ids.infraId) return;
            try {
                const data = await apiGet(`/infra/${ids.infraId}/servers?environment=staging`);
                if (data) {
                    setWebServers(data.web || []);
                    setAppServers(data.app || []);
                    setDbServers(data.db || []);
                    setOtherServers(data.other || []);
                }
            } catch (err) {
                console.error("Could not load saved staging servers:", err);
            }
        }
        loadExisting();
    }, [ids.infraId]);

    function addWebServer() {
        setWebServers((prev) => [...prev, emptyServer()]);
    }

    function updateWebServer(index, field, value) {
        setWebServers((prev) => {
            const updated = [...prev];
            const server = { ...updated[index], [field]: value };
            if (field === "external_storage" && value !== "Other") {
                server.external_storage_other = "";
            }
            if (field === "os" && value !== "Other") {
                server.os_other = "";
            }
            updated[index] = server;
            return updated;
        });
    }
    function deleteWebServer(index) {
        setWebServers((prev) => {
            const updated = prev.filter((server, i) => {
                return i !== index;
            });
            return updated;
        });
    }

    function addAppServer() {
        setAppServers((prev) => [...prev, emptyServer()]);
    }
    function updateAppServer(index, field, value) {
        setAppServers((prev) => {
            const updated = [...prev];
            const server = { ...updated[index], [field]: value };
            if (field === "external_storage" && value !== "Other") {
                server.external_storage_other = "";
            }
            if (field === "os" && value !== "Other") {
                server.os_other = "";
            }
            updated[index] = server;
            return updated;
        });
    }
    function deleteAppServer(index) {
        setAppServers((prev) => {
            const updated = prev.filter((server, i) => {
                return i !== index;
            });
            return updated;
        });
    }

    function addDbServer() {
        setDbServers((prev) => [...prev, emptyDbServer()]);
    }
    function updateDbServer(index, field, value) {
        setDbServers((prev) => {
            const updated = [...prev];
            const server = { ...updated[index], [field]: value };
            if (field === "external_storage" && value !== "Other") {
                server.external_storage_other = "";
            }
            if (field === "os" && value !== "Other") {
                server.os_other = "";
            }
            updated[index] = server;
            return updated;
        });
    }
    function deleteDbServer(index) {
        setDbServers((prev) => {
            const updated = prev.filter((server, i) => {
                return i !== index;
            });
            return updated;
        });
    }


    function addOtherServer() {
        setOtherServers((prev) => [...prev, emptyServer()]);
    }
    function updateOtherServer(index, field, value) {
        setOtherServers((prev) => {
            const updated = [...prev];
            const server = { ...updated[index], [field]: value };
            if (field === "external_storage" && value !== "Other") {
                server.external_storage_other = "";
            }
            if (field === "os" && value !== "Other") {
                server.os_other = "";
            }
            updated[index] = server;
            return updated;
        });
    }
    function deleteOtherServer(index) {
        setOtherServers((prev) => {
            const updated = prev.filter((server, i) => {
                return i !== index;
            });
            return updated;
        });
    }


    function validateForm() {
        const allServers = [...webServers, ...appServers, ...dbServers, ...otherServers];
        const anyInvalid = allServers.some((server) => Object.keys(validateServer(server)).length > 0);
        if (anyInvalid) {
            setError("Please fill in all required fields for every server listed below.");
            return false;
        }
        return true;
    }

    async function Nextpage() {
        setError("");
        if (!validateForm()) return;
        if (!ids.appId) {
            setError("Application record not found yet — please complete earlier steps first.");
            return;
        }
        setSaving(true);
        try {
            let infraId = ids.infraId;
            if (!infraId) {
                const res = await apiPost("/infra", { app_id: ids.appId });
                infraId = res.id;
                setId("infraId", infraId);
            }
            await apiPut(`/infra/${infraId}/servers`, {
                environment: "staging",
                web: webServers,
                app: appServers,
                db: dbServers,
                other: otherServers,
            });
            navigate("/productiondetails");
        } catch (err) {
            console.error(err);
            setError("Could not save Staging Server Details.");
        } finally {
            setSaving(false);
        }
    }

    function Backpage() {
        navigate("/certificatedetails");
    }

    return (
        <Layout>
            <div className="form-container">
                <h2 className="section-heading">Staging Server Requirements (Annexure-5A)</h2>


                <div className="form-section">
                    <div className="section-header-row">
                        <h3>Web Servers</h3>
                        <button type="button" className="add-server-button" onClick={addWebServer}>+ Add Web Server</button>
                    </div>

                    <table className="server-table">
                        <thead>
                            <tr>
                                <th>Web Servers</th>
                                <th>Processor (VCPU)</th>
                                <th>RAM (in GB)</th>
                                <th>Internal Storage (in GB)</th>
                                <th>External Storage</th>
                                <th>External Storage Capacity</th>
                                <th>Operating System</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {webServers.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="empty-row">No web servers added yet</td>
                                </tr>
                            )}
                            {webServers.map((server, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input type="text" value={server.processor} onChange={(e) => updateWebServer(index, "processor", e.target.value)} placeholder="i.e. 2-core, 4-core, 8-core" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.ram} onChange={(e) => updateWebServer(index, "ram", e.target.value)} placeholder="i.e. 16 GB, 32 GB etc" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.internal_storage} onChange={(e) => updateWebServer(index, "internal_storage", e.target.value)} placeholder="i.e. 100 GB, 500 GB, 1TB etc" />
                                    </td>
                                    <td>
                                        <select value={server.external_storage} onChange={(e) => updateWebServer(index, "external_storage", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="SAN">SAN</option>
                                            <option value="NAS">NAS</option>
                                            <option value="Unified">Unified</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {server.external_storage === "Other" && (
                                            <input type="text" value={server.external_storage_other} onChange={(e) => updateWebServer(index, "external_storage_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>

                                        <input type="text" value={server.external_storage_capacity} onChange={(e) => updateWebServer(index, "external_storage_capacity", e.target.value)} placeholder="i.e. 500 GB, 1TB etc" />

                                    </td>
                                    <td>
                                        <select value={server.os} onChange={(e) => updateWebServer(index, "os", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="Windows Server Standard">Windows Server Standard</option>
                                            <option value="RHEL Standard">RHEL Standard</option>
                                            <option value="Linux Community">Linux Community</option>
                                            <option value="Other">Other</option>
                                            <option value="None">None</option>
                                        </select>
                                        {server.os === "Other" && (
                                            <input type="text" value={server.os_other} onChange={(e) => updateWebServer(index, "os_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>
                                        <button type="button" className="delete-row-button" onClick={() => deleteWebServer(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="form-section">
                    <div className="section-header-row">
                        <h3>Application Servers</h3>
                        <button type="button" className="add-server-button" onClick={addAppServer}>+ Add Application Server</button>
                    </div>

                    <table className="server-table">
                        <thead>
                            <tr>
                                <th>Application Servers</th>
                                <th>Processor</th>
                                <th>RAM</th>
                                <th>Internal Storage</th>
                                <th>External Storage</th>
                                <th>External Storage Capacity</th>
                                <th>Operating System</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {appServers.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="empty-row">No application servers added yet</td>
                                </tr>
                            )}
                            {appServers.map((server, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input type="text" value={server.processor} onChange={(e) => updateAppServer(index, "processor", e.target.value)} placeholder="i.e. 2-core, 4-core, 8-core" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.ram} onChange={(e) => updateAppServer(index, "ram", e.target.value)} placeholder="i.e. 16 GB, 32 GB etc" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.internal_storage} onChange={(e) => updateAppServer(index, "internal_storage", e.target.value)} placeholder="i.e. 100 GB, 500 GB, 1TB etc" />
                                    </td>
                                    <td>
                                        <select value={server.external_storage} onChange={(e) => updateAppServer(index, "external_storage", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="SAN">SAN</option>
                                            <option value="NAS">NAS</option>
                                            <option value="Unified">Unified</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {server.external_storage === "Other" && (
                                            <input type="text" value={server.external_storage_other} onChange={(e) => updateAppServer(index, "external_storage_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>

                                        <input type="text" value={server.external_storage_capacity} onChange={(e) => updateAppServer(index, "external_storage_capacity", e.target.value)} placeholder="i.e. 500 GB, 1TB etc" />

                                    </td>
                                    <td>
                                        <select value={server.os} onChange={(e) => updateAppServer(index, "os", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="Windows Server Standard">Windows Server Standard</option>
                                            <option value="RHEL Standard">RHEL Standard</option>
                                            <option value="Linux Community">Linux Community</option>
                                            <option value="Other">Other</option>
                                            <option value="None">None</option>
                                        </select>
                                        {server.os === "Other" && (
                                            <input type="text" value={server.os_other} onChange={(e) => updateAppServer(index, "os_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>
                                        <button type="button" className="delete-row-button" onClick={() => deleteAppServer(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="form-section">
                    <div className="section-header-row">
                        <h3>Database Servers</h3>
                        <button type="button" className="add-server-button" onClick={addDbServer}>+ Add Database Server</button>
                    </div>

                    <table className="server-table">
                        <thead>
                            <tr>
                                <th>Database Servers</th>
                                <th>Processor</th>
                                <th>RAM</th>
                                <th>Internal Storage</th>
                                <th>External Storage</th>
                                <th>External Storage Capacity</th>
                                <th>Operating System</th>
                                <th>Database Version</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dbServers.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="empty-row">No database servers added yet</td>
                                </tr>
                            )}
                            {dbServers.map((server, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input type="text" value={server.processor} onChange={(e) => updateDbServer(index, "processor", e.target.value)} placeholder="i.e. 2-core, 4-core, 8-core" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.ram} onChange={(e) => updateDbServer(index, "ram", e.target.value)} placeholder="i.e. 16 GB, 32 GB etc" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.internal_storage} onChange={(e) => updateDbServer(index, "internal_storage", e.target.value)} placeholder="i.e. 100 GB, 500 GB, 1TB etc" />
                                    </td>
                                    <td>
                                        <select value={server.external_storage} onChange={(e) => updateDbServer(index, "external_storage", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="SAN">SAN</option>
                                            <option value="NAS">NAS</option>
                                            <option value="Unified">Unified</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {server.external_storage === "Other" && (
                                            <input type="text" value={server.external_storage_other} onChange={(e) => updateDbServer(index, "external_storage_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>

                                        <input type="text" value={server.external_storage_capacity} onChange={(e) => updateDbServer(index, "external_storage_capacity", e.target.value)} placeholder="i.e. 500 GB, 1TB etc" />

                                    </td>
                                    <td>
                                        <select value={server.os} onChange={(e) => updateDbServer(index, "os", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="Windows Server Standard">Windows Server Standard</option>
                                            <option value="RHEL Standard">RHEL Standard</option>
                                            <option value="Linux Community">Linux Community</option>
                                            <option value="Other">Other</option>
                                            <option value="None">None</option>
                                        </select>
                                        {server.os === "Other" && (
                                            <input type="text" value={server.os_other} onChange={(e) => updateDbServer(index, "os_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>
                                        <input type="text" value={server.version} onChange={(e) => updateDbServer(index, "version", e.target.value)} placeholder="i.e. Oracle10g, Sql 2005 etc" />
                                    </td>
                                    <td>
                                        <button type="button" className="delete-row-button" onClick={() => deleteDbServer(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="form-section">
                    <div className="section-header-row">
                        <h3>Other Servers</h3>
                        <button type="button" className="add-server-button" onClick={addOtherServer}>+ Add Other Server</button>
                    </div>

                    <table className="server-table">
                        <thead>
                            <tr>
                                <th>Other Servers</th>
                                <th>Processor</th>
                                <th>RAM</th>
                                <th>Internal Storage</th>
                                <th>External Storage</th>
                                <th>External Storage Capacity</th>
                                <th>Operating System</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherServers.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="empty-row">No other servers added yet</td>
                                </tr>
                            )}
                            {otherServers.map((server, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input type="text" value={server.processor} onChange={(e) => updateOtherServer(index, "processor", e.target.value)} placeholder="i.e. 2-core, 4-core, 8-core" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.ram} onChange={(e) => updateOtherServer(index, "ram", e.target.value)} placeholder="i.e. 16 GB, 32 GB etc" />
                                    </td>
                                    <td>
                                        <input type="text" value={server.internal_storage} onChange={(e) => updateOtherServer(index, "internal_storage", e.target.value)} placeholder="i.e. 100 GB, 500 GB, 1TB etc" />
                                    </td>
                                    <td>
                                        <select value={server.external_storage} onChange={(e) => updateOtherServer(index, "external_storage", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="SAN">SAN</option>
                                            <option value="NAS">NAS</option>
                                            <option value="Unified">Unified</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {server.external_storage === "Other" && (
                                            <input type="text" value={server.external_storage_other} onChange={(e) => updateOtherServer(index, "external_storage_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>

                                        <input type="text" value={server.external_storage_capacity} onChange={(e) => updateOtherServer(index, "external_storage_capacity", e.target.value)} placeholder="i.e. 500 GB, 1TB etc" />

                                    </td>
                                    <td>
                                        <select value={server.os} onChange={(e) => updateOtherServer(index, "os", e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option value="Windows Server Standard">Windows Server Standard</option>
                                            <option value="RHEL Standard">RHEL Standard</option>
                                            <option value="Linux Community">Linux Community</option>
                                            <option value="Other">Other</option>
                                            <option value="None">None</option>
                                        </select>
                                        {server.os === "Other" && (
                                            <input type="text" value={server.os_other} onChange={(e) => updateOtherServer(index, "os_other", e.target.value)} placeholder="Please specify" />
                                        )}
                                    </td>
                                    <td>
                                        <button type="button" className="delete-row-button" onClick={() => deleteOtherServer(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {error && <p className="form-error">{error}</p>}

                <FormButtons showBack={true} onBack={Backpage} onNext={Nextpage} disabled={saving} saving={saving} />
            </div>
        </Layout>
    );
}

export default StagingDetails;