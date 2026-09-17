import { useState, useEffect, useRef } from "react"
import Layout from "../components/Layout";
import "./PreviewDetails.css";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiGet } from "../api";
import html2pdf from "html2pdf.js";

function PreviewDetails() {

    const navigate = useNavigate();
    const { ids } = useFormContext();
    const pdfRef = useRef(null);

    const [org, setOrg] = useState(null);
    const [app, setApp] = useState(null);
    const [infra, setInfra] = useState(null);
    const [stagingServers, setStagingServers] = useState(null);
    const [productionServers, setProductionServers] = useState(null);
    const [checklist, setChecklist] = useState(null);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        async function loadAll() {
            try {
                const [orgData, appData, infraData, stagingData, productionData, checklistData] = await Promise.all([
                    //Promise.all means six API requests concurrently const orgData = await apiGet(...); , const appData = await apiGet(...);...
                    ids.orgId ? apiGet(`/org/${ids.orgId}`) : null,
                    ids.appId ? apiGet(`/apps/${ids.appId}`) : null,
                    ids.infraId ? apiGet(`/infra/${ids.infraId}`) : null,
                    ids.infraId ? apiGet(`/infra/${ids.infraId}/servers?environment=staging`) : null,
                    ids.infraId ? apiGet(`/infra/${ids.infraId}/servers?environment=production`) : null,
                    ids.checklistId ? apiGet(`/checklist/${ids.checklistId}`) : null,
                ]);
                setOrg(orgData);
                setApp(appData);
                setInfra(infraData);
                setStagingServers(stagingData);
                setProductionServers(productionData);
                setChecklist(checklistData);
            } catch (err) {
                setError("Could not load your submission details. Please go back and check each step.");
            }
        }
        loadAll();
    }, [ids.orgId, ids.appId, ids.infraId, ids.checklistId]);

    function Backpage() {
        navigate("/checklist");
    }

    function handleSubmit() {
        setSubmitted(true);
    }

    function handleDownload() {
        html2pdf()
            .set({
                margin: 7,
                filename: "hosting-requisition-form.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                pagebreak: { mode: ["css", "legacy"] },
            })
            .from(pdfRef.current)
            .save();
    }


    return (
        <Layout>

               {!submitted && (
    <div className="box">
        <h3>This is a preview of your submission. It has not been submitted yet!</h3>
        <label className="grey">Please take a moment to verify your information. You can also go back to make changes.</label>
    </div>
)}
            

            <div ref={pdfRef}>

                {org && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">1</span>
                            <h3>Organization Details</h3>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Organization Name</label>
                                <p>{org.name || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Organization Type</label>
                                <p>{org.type || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Organization Other</label>
                                <p>{org.type_other || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Nodal Officer Name</label>
                                <p>{org.officer || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Designation</label>
                                <p>{org.officer_designation || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Email</label>
                                <p>{org.email || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Office Phone No.</label>
                                <p>{org.phone_office || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Contact No.</label>
                                <p>{org.phone || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Office Address</label>
                                <p>{org.address || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>DoIT Officer Name</label>
                                <p>{org.contact_name || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Designation</label>
                                <p>{org.contact_designation || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Contact Number</label>
                                <p>{org.contact_phone || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Email Address</label>
                                <p>{org.contact_email || "-"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {app && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">2</span>
                            <h3>Application Details</h3>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Application Name</label>
                                <p>{app.name || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Type</label>
                                <p>{app.type || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Type Other </label>
                                <p>{app.type_other || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Nature</label>
                                <p>{app.nature || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Utility</label>
                                <p>{app.utility || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Utility Other</label>
                                <p>{app.utility_other || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Purpose</label>
                                <p>{app.purpose || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>URL</label>
                                <p>{app.url || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Alternate URL</label>
                                <p>{app.alternate_url || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Authority Name</label>
                                <p>{app.approval_authority || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Designation</label>
                                <p>{app.approval_designation || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>SEMT/Administrative Approval</label>
                                <p>{app.semt_approved || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>MoM / Document Reference No. </label>
                                <p>{app.mom_ref_no || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Date</label>
                                <p>{app.mom_date || "-"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {app && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">3</span>
                            <h3>Developer, Maintenance Team Details</h3>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Name of the Company / Agency</label>
                                <p>{app.dev_company || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Other Company Name</label>
                                <p>{app.dev_company_other || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Name of Contact Person </label>
                                <p>{app.dev_contact_person || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Address</label>
                                <p>{app.dev_address || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Phone No. (Office)</label>
                                <p>{app.dev_phone_office || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Phone No. (Mobile)</label>
                                <p>{app.dev_phone || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>E-Mail Address</label>
                                <p>{app.dev_email || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Website/Application is Under Maintenance</label>
                                <p>{app.maint_active || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Expiry</label>
                                <p>{app.maint_expiry || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Name of the Company / Agency maintaining</label>
                                <p>{app.maint_company || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Name of Contact Person</label>
                                <p>{app.maint_contact_person || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Address</label>
                                <p>{app.maint_address || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Phone No.(Office)</label>
                                <p>{app.maint_phone_office || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Phone No. (Mobile)</label>
                                <p>{app.maint_phone_mobile || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Email Address</label>
                                <p>{app.maint_email || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Contract Copy(ies) Attached</label>
                                <p>{app.maint_contract_attached || "-"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {app && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">4</span>
                            <h3>Certificate Details</h3>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Name of Certifying Agency</label>
                                <p>{app.safehost_agency || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Other Certifying Agency</label>
                                <p>{app.safehost_agency_other || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>CERT-In Empanelment Number</label>
                                <p>{app.safehost_empanel_no || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Empanelment Valid Till </label>
                                <p>{app.safehost_empanel_valid_till || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Security Audit Certificate Reference Number</label>
                                <p>{app.safehost_ref_no || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Certificate Issue Date</label>
                                <p>{app.safehost_issue_date || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Certificate Valid Till</label>
                                <p>{app.safehost_valid_till || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Name of Certifying Agency for Load Test Certificate Details</label>
                                <p>{app.loadtest_agency || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Other Certifying Agency</label>
                                <p>{app.loadtest_agency_other || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Load Tested (Maximum Users)</label>
                                <p>{app.load_users || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Average Response Time</label>
                                <p>{app.loadtest_avg_response || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Certificate Reference Number</label>
                                <p>{app.loadtest_ref_no || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Certificate Issue Date</label>
                                <p>{app.loadtest_issue_date || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Certificate Valid Till</label>
                                <p>{app.loadtest_valid_till || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Other Certificate Details</label>
                                <p>{app.other_certificate_details || "-"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {stagingServers && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">5</span>
                            <h3>VM / Server Requirements of Staging</h3>
                        </div>

                        <h4 className="doc-subheading">Web Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stagingServers.web.length === 0 && <tr><td colSpan={7} className="doc-empty-row">None added</td></tr>}
                                {stagingServers.web.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 className="doc-subheading">Application Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stagingServers.app.length === 0 && <tr><td colSpan={7} className="doc-empty-row">None added</td></tr>}
                                {stagingServers.app.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 className="doc-subheading">Database Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th><th>DB Version</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stagingServers.db.length === 0 && <tr><td colSpan={8} className="doc-empty-row">None added</td></tr>}
                                {stagingServers.db.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                        <td>{server.version || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 className="doc-subheading">Other Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stagingServers.other.length === 0 && <tr><td colSpan={7} className="doc-empty-row">None added</td></tr>}
                                {stagingServers.other.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {productionServers && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">6</span>
                            <h3>VM / Server Requirements of Production</h3>
                        </div>

                        <h4 className="doc-subheading">Web Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionServers.web.length === 0 && <tr><td colSpan={7} className="doc-empty-row">None added</td></tr>}
                                {productionServers.web.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 className="doc-subheading">Application Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionServers.app.length === 0 && <tr><td colSpan={7} className="doc-empty-row">None added</td></tr>}
                                {productionServers.app.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 className="doc-subheading">Database Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th><th>DB Version</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionServers.db.length === 0 && <tr><td colSpan={8} className="doc-empty-row">None added</td></tr>}
                                {productionServers.db.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                        <td>{server.version || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 className="doc-subheading">Other Servers</h4>
                        <table className="doc-table">
                            <thead>
                                <tr>
                                    <th>#</th><th>Processor</th><th>RAM</th><th>Internal Storage</th><th>External Storage</th><th>Ext. Capacity</th><th>OS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionServers.other.length === 0 && <tr><td colSpan={7} className="doc-empty-row">None added</td></tr>}
                                {productionServers.other.map((server, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{server.processor || "-"}</td>
                                        <td>{server.ram || "-"}</td>
                                        <td>{server.internal_storage || "-"}</td>
                                        <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                        <td>{server.external_storage_capacity || "-"}</td>
                                        <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {infra && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">7</span>
                            <h3>Software, SFTP, Network, Monitoring & Backup</h3>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Web Server Software with Version</label>
                                <p>{infra.software || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Application Server with Version</label>
                                <p>{infra.app_server_software || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width">
                                <label>Integration with Other Software Systems</label>
                                <p>{infra.integration_software || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>SFTP Access Required</label>
                                <p>{infra.sftp_needed || "-"}</p>
                            </div>
                            {infra.sftp_needed === "Yes" && (
                                <>
                                    <div className="doc-row">
                                        <label>Real IP</label>
                                        <p>{infra.sftp_ip || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Proposed SFTP User Name</label>
                                        <p>{infra.sftp_username || "-"}</p>
                                    </div>
                                </>
                            )}
                            <div className="doc-row">
                                <label>Public IP</label>
                                <p>{infra.public_ip || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>DNS Entry</label>
                                <p>{infra.dns_entry || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>APM Required</label>
                                <p>{infra.apm_required || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Backup Services Required</label>
                                <p>{infra.backup || "-"}</p>
                            </div>
                            {infra.backup === "Yes" && (
                                <div className="doc-row">
                                    <label>Retention Period</label>
                                    <p>{infra.backup_retention || "-"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {infra && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">8</span>
                            <h3>Hardware Details</h3>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Hardware Type</label>
                                <p>{infra.hw_type || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Brand</label>
                                <p>{infra.hw_brand || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Model</label>
                                <p>{infra.hw_model || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>CPU</label>
                                <p>{infra.hw_cpu || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>RAM</label>
                                <p>{infra.hw_ram || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>HDD</label>
                                <p>{infra.hw_hdd || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>HBA Card</label>
                                <p>{infra.hw_hba_card || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Fiber Cable</label>
                                <p>{infra.hw_fiber_cable || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Power</label>
                                <p>{infra.hw_power || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Rack Provided</label>
                                <p>{infra.hw_rack_provided || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Rack Type</label>
                                <p>{infra.hw_rack_type || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Insurance</label>
                                <p>{infra.hw_insurance || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Antivirus Name</label>
                                <p>{infra.hw_antivirus_name || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Antivirus Expiry</label>
                                <p>{infra.hw_antivirus_expiry || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>PO Attached</label>
                                <p>{infra.hw_po_attached || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Special Environment Requirements</label>
                                <p>{infra.hw_special_env || "-"}</p>
                            </div>

                            <div className="doc-row">
                                <label>FMS Required</label>
                                <p>{infra.hw_fms || "-"}</p>
                            </div>
                            {infra.hw_fms === "Yes" && (
                                <>
                                    <div className="doc-row">
                                        <label>FMS Company</label>
                                        <p>{infra.hw_fms_company || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>FMS Contact Person</label>
                                        <p>{infra.hw_fms_contact_person || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>FMS Address</label>
                                        <p>{infra.hw_fms_address || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>FMS Phone (Office)</label>
                                        <p>{infra.hw_fms_phone_office || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>FMS Phone (Mobile)</label>
                                        <p>{infra.hw_fms_phone_mobile || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>FMS Email</label>
                                        <p>{infra.hw_fms_email || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>FMS Contract Expiry</label>
                                        <p>{infra.hw_fms_contract_expiry || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>FMS Contract Attached</label>
                                        <p>{infra.hw_fms_contract_attached || "-"}</p>
                                    </div>
                                </>
                            )}

                            <div className="doc-row">
                                <label>AMC Required</label>
                                <p>{infra.hw_amc || "-"}</p>
                            </div>
                            {infra.hw_amc === "Yes" && (
                                <>
                                    <div className="doc-row">
                                        <label>AMC Company</label>
                                        <p>{infra.hw_amc_company || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>AMC Contact Person</label>
                                        <p>{infra.hw_amc_contact_person || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>AMC Address</label>
                                        <p>{infra.hw_amc_address || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>AMC Phone (Office)</label>
                                        <p>{infra.hw_amc_phone_office || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>AMC Phone (Mobile)</label>
                                        <p>{infra.hw_amc_phone_mobile || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>AMC Email</label>
                                        <p>{infra.hw_amc_email || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>AMC Contract Expiry</label>
                                        <p>{infra.hw_amc_contract_expiry || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>AMC Contract Attached</label>
                                        <p>{infra.hw_amc_contract_attached || "-"}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}


                {infra && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">9</span>
                            <h3>SSL Certificate Details</h3>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Dedicated SSL Certificate</label>
                                <p>{infra.ssl_needed || "-"}</p>
                            </div>
                            {infra.ssl_needed === "Yes" && (
                                <>
                                    <div className="doc-row">
                                        <label>SSL Provider Type</label>
                                        <p>{infra.ssl_provider_type || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Environment</label>
                                        <p>{infra.ssl_environment || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>URL / FQDN</label>
                                        <p>{infra.ssl_fqdn || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>SSL Type Required</label>
                                        <p>{(infra.ssl_type && infra.ssl_type.length > 0) ? infra.ssl_type.join(", ") : "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>TLS Version</label>
                                        <p>{infra.ssl_tls_version || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Issue Date</label>
                                        <p>{infra.ssl_issue_date || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Expiry Date</label>
                                        <p>{infra.ssl_expiry || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Validity Period</label>
                                        <p>{infra.ssl_validity_period || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Certificate Authority (CA)</label>
                                        <p>{infra.ssl_ca || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Certificate Vendor</label>
                                        <p>{infra.ssl_vendor || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Renewal Responsibility</label>
                                        <p>{infra.ssl_renewal_responsibility || "-"}</p>
                                    </div>
                                    <div className="doc-row doc-full-width">
                                        <label>Renewal Contact Details</label>
                                        <p>{infra.ssl_renewal_contact || "-"}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {checklist && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">10</span>
                            <h3>Checklist for Secure Code Programming</h3>
                        </div>

                        <h4 className="doc-subheading">10.1 Action Item(s)</h4>
                        <div className="doc-grid">
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>1.</strong> Implement CAPTCHA on all entry forms in PUBLIC pages. Implement CAPTCHA or account-lockout feature on the login form.</label>
                                <p>{checklist.captcha_lockout_login || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>2.</strong> Implement proper validations on all input parameters in client and serverside (both).</label>
                                <p>{checklist.input_validation_client_server || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>3.</strong> Use parameterized queries or Stored-procedures instead of inline SQL queries.</label>
                                <p>{checklist.parameterized_queries_sql_injection || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>4.</strong> Implement proper Audit/Action Trails in applications</label>
                                <p>{checklist.audit_action_trails || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>5.</strong> Use different Pre and Post authentication session values/Authentication-cookies</label>
                                <p>{checklist.pre_post_auth_session_cookies || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>6.</strong> Implement proper Access matrix (ACL) to prevent un-authorized access.</label>
                                <p>{checklist.access_control_list_acl || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>7.</strong> Do not reference components directly from third-party sites.</label>
                                <p>{checklist.no_direct_thirdparty_reference || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>8.</strong> Use third-Party components from trusted source only.</label>
                                <p>{checklist.trusted_thirdparty_components || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>9.</strong> Store critical data in encrypted form in the database.</label>
                                <p>{checklist.encrypted_critical_data || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>10.</strong> Prevent critical information from public access by any means.</label>
                                <p>{checklist.restrict_public_critical_info || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>11.</strong> Hash the password before it is relayed over network or stored in database.</label>
                                <p>{checklist.password_hashing_sha || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>12.</strong> Implement Change Password and Forgot password module in applications.</label>
                                <p>{checklist.change_forgot_password_module || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>13.</strong> Comply with Password Policy, wherever passwords are being used.</label>
                                <p>{checklist.password_policy_compliance || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>14.</strong> Use Post methods to pass parameters from one page/website to another.</label>
                                <p>{checklist.post_method_usage || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>15.</strong> Implement proper error-handling.</label>
                                <p>{checklist.proper_error_handling || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>16.</strong> Implement token-based system that changes on every web request, to prevent CSRF.</label>
                                <p>{checklist.csrf_token_protection || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>17.</strong> Do not implement File upload in public modules</label>
                                <p>{checklist.no_file_upload_public || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>18.</strong> Store uploaded files in database, rather than in file system.</label>
                                <p>{checklist.files_stored_in_database || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>19.</strong> Generate unique, un-predictable and non-sequential IDs/reference numbers.</label>
                                <p>{checklist.unique_unpredictable_ids || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>20.</strong> Implement proper Session Timeout.</label>
                                <p>{checklist.session_timeout || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>21.</strong> Assure admin/Super-Admin URL's is/are accessible from restricted IP's only.</label>
                                <p>{checklist.admin_url_restricted_ip || "-"}</p>
                            </div>
                        </div>

                        <h4 className="doc-subheading">10.2 Other Action Item(s)</h4>
                        <div className="doc-grid">
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>1.</strong> Assure third-Party links/page open in different tab, with a disclaimer.</label>
                                <p>{checklist.thirdparty_links_new_tab || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>2.</strong> Disable Trace/PUT/DELETE and other non-required methods.</label>
                                <p>{checklist.disable_trace_put_delete || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>3.</strong> Assure that Email addresses, where ever used, are in form of an image.</label>
                                <p>{checklist.email_image_format || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>4.</strong> Disable directory listing</label>
                                <p>{checklist.disable_directory_listing || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>5.</strong> Set 'Auto Complete' off for textboxes in forms</label>
                                <p>{checklist.autocomplete_off_forms || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>6.</strong> Prevent pages from being stored in history/cache.</label>
                                <p>{checklist.prevent_page_caching || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>7.</strong> Implement Logout buttons in all authenticated pages</label>
                                <p>{checklist.logout_button_all_pages || "-"}</p>
                            </div>
                        </div>

                        <h4 className="doc-subheading">10.3 Implementation Guidelines</h4>
                        <div className="doc-grid">
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>1.</strong> Restrict each application for minimum access (only required access).</label>
                                <p>{checklist.restricted_min_access || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>2.</strong> Use the latest and non-vulnerable versions of Application Server, etc.</label>
                                <p>{checklist.latest_nonvulnerable_versions || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>3.</strong> Enable audit-trails and system logs on server.</label>
                                <p>{checklist.audit_trail_system_logs || "-"}</p>
                            </div>
                            <div className="doc-row doc-full-width doc-checklist-row">
                                <label><strong>4.</strong> Take regular backups of data and application.</label>
                                <p>{checklist.regular_backups || "-"}</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {error && <p className="form-error">{error}</p>}

          {submitted ? (
    <div className="box">
        <h3>Your form has been submitted successfully!</h3>
        <label className="grey">You can download a PDF copy of your submission below for your records.</label>
        <div>
            <button type="button" className="download-button" onClick={handleDownload}>Download PDF</button>
        </div>
    </div>
) : (
    <>
        <input type="button" value="Previous" onClick={Backpage} className="back-button" />
        <input type="button" value="Submit" onClick={handleSubmit} className="submit-button" />
    </>
)}
        </Layout>
    );
}

export default PreviewDetails;