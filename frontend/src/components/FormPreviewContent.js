import { useNavigate } from "react-router-dom";

function FormPreviewContent({ org, app, infra, stagingServers, productionServers, checklist }) {
    const navigate = useNavigate();

    function renderServerSection(title, servers, showVersion, showServerName) {
        const filtered = servers.filter((server) => {
            return (
                (server.processor && server.processor.trim()) ||
                (server.ram && server.ram.trim()) ||
                (server.internal_storage && server.internal_storage.trim()) ||
                (server.external_storage_capacity && server.external_storage_capacity.trim()) ||
                (server.external_storage && server.external_storage !== "None") ||
                (server.os && server.os !== "None") ||
                (server.server_name && server.server_name.trim()) ||
                (server.version && server.version.trim())
            );
        });

        if (filtered.length === 0) return null;

        return (
            <>
                <h4 className="doc-subheading">{title}</h4>
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            {showServerName && <th>Name of Server</th>}
                            <th>Processor</th>
                            <th>RAM</th>
                            <th>Internal Storage</th>
                            <th>External Storage Unit</th>
                            <th>External Storage</th>
                            <th>Ext. Capacity</th>
                            <th>OS</th>
                            {showVersion && <th>DB Version</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((server, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                {showServerName && <td>{server.server_name || "-"}</td>}
                                <td>{server.processor || "-"}</td>
                                <td>{server.ram || "-"}</td>
                                <td>{server.internal_storage || "-"}</td>
                                <td>{server.external_storage_unit || "-"}</td>
                                <td>{server.external_storage === "Other" ? server.external_storage_other : server.external_storage || "-"}</td>
                                <td>{server.external_storage_capacity || "-"}</td>
                                <td>{server.os === "Other" ? server.os_other : server.os || "-"}</td>
                                {showVersion && <td>{server.version || "-"}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }

    return (
        <>
                {org && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">1</span>
                            <h3>Organization Details</h3>
                            <button type="button" className="edit-section-button" onClick={() => navigate("/organization")}>Edit</button>
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
                            {org.type === "other" && (
                                <div className="doc-row">
                                    <label>Organization Other</label>
                                    <p>{org.type_other || "-"}</p>
                                </div>
                            )}
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
                            <button type="button" className="edit-section-button" onClick={() => navigate("/ApplicationDetails")}>Edit</button>
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
                            {app.type === "Other" && (
                                <div className="doc-row">
                                    <label>Type Other </label>
                                    <p>{app.type_other || "-"}</p>
                                </div>
                            )}
                            <div className="doc-row">
                                <label>Nature</label>
                                <p>{app.nature || "-"}</p>
                            </div>
                            <div className="doc-row">
                                <label>Utility</label>
                                <p>{app.utility || "-"}</p>
                            </div>
                            {app.utility === "Other Priority Event" && (
                                <div className="doc-row">
                                    <label>Utility Other</label>
                                    <p>{app.utility_other || "-"}</p>
                                </div>
                            )}
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
                            {app.semt_approved === "Yes" && (
                                <>
                                    <div className="doc-row">
                                        <label>MoM / Document Reference No. </label>
                                        <p>{app.mom_ref_no || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Date</label>
                                        <p>{app.mom_date || "-"}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {app && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">3</span>
                            <h3>Developer, Maintenance Team Details</h3>
                            <button type="button" className="edit-section-button" onClick={() => navigate("/maindetails")}>Edit</button>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Name of the Company / Agency</label>
                                <p>{app.dev_company || "-"}</p>
                            </div>
                            {app.dev_company === "other" && (
                                <div className="doc-row">
                                    <label>Other Company Name</label>
                                    <p>{app.dev_company_other || "-"}</p>
                                </div>
                            )}
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
                            {app.maint_active === "Yes" && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                )}

                {app && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">4</span>
                            <h3>Certificate Details</h3>
                            <button type="button" className="edit-section-button" onClick={() => navigate("/certificatedetails")}>Edit</button>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Name of Certifying Agency</label>
                                <p>{app.safehost_agency || "-"}</p>
                            </div>
                            {app.safehost_agency === "Other Agency" && (
                                <div className="doc-row">
                                    <label>Other Certifying Agency</label>
                                    <p>{app.safehost_agency_other || "-"}</p>
                                </div>
                            )}
                            {app.safehost_agency === "CERT-In Empanelled" && (
                                <>
                                    <div className="doc-row">
                                        <label>CERT-In Empanelment Number</label>
                                        <p>{app.safehost_empanel_no || "-"}</p>
                                    </div>
                                    <div className="doc-row">
                                        <label>Empanelment Valid Till </label>
                                        <p>{app.safehost_empanel_valid_till || "-"}</p>
                                    </div>
                                </>
                            )}
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
                                <label>Load Test Required</label>
                                <p>{app.loadtest_required || "-"}</p>
                            </div>
                            {app.loadtest_required === "Yes" && (
                                <>
                                    <div className="doc-row">
                                        <label>Name of Certifying Agency for Load Test Certificate Details</label>
                                        <p>{app.loadtest_agency || "-"}</p>
                                    </div>
                                    {app.loadtest_agency === "Other Agency" && (
                                        <div className="doc-row">
                                            <label>Other Certifying Agency</label>
                                            <p>{app.loadtest_agency_other || "-"}</p>
                                        </div>
                                    )}
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
                                </>
                            )}
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
                            <button type="button" className="edit-section-button" onClick={() => navigate("/stagingdetails")}>Edit</button>
                        </div>

                        {renderServerSection("Web Server(VM)", stagingServers.web, false, false)}
                        {renderServerSection("Application Server(VM)", stagingServers.app, false, false)}
                        {renderServerSection("Database Server(VM)", stagingServers.db, true, false)}
                        {renderServerSection("other Servers(VM)", stagingServers.other, false, true)}
                    </div>
                )}

                {productionServers && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">6</span>
                            <h3>VM / Server Requirements of Production</h3>
                            <button type="button" className="edit-section-button" onClick={() => navigate("/productiondetails")}>Edit</button>
                        </div>

                        {renderServerSection("Web Server(VM)", productionServers.web, false, false)}
                        {renderServerSection("Application Server(VM)", productionServers.app, false, false)}
                        {renderServerSection("Database Server(VM)", productionServers.db, true, false)}
                        {renderServerSection("other Servers(VM)", productionServers.other, false, true)}
                    </div>
                )}

                {infra && (
                    <div className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-badge">7</span>
                            <h3>Software, SFTP, Network, Monitoring & Backup</h3>
                            <button type="button" className="edit-section-button" onClick={() => navigate("/infraotherdetails")}>Edit</button>
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
                            <button type="button" className="edit-section-button" onClick={() => navigate("/hardwaredetails")}>Edit</button>
                        </div>
                        <div className="doc-grid">
                            <div className="doc-row">
                                <label>Physical Hardware Requirement</label>
                                <p>{infra.physical_hw_required || "-"}</p>
                            </div>
                            {infra.physical_hw_required === "Yes" && (
                                <>
                                    <div className="doc-row">
                                        <label>Hardware Type</label>
                                        <p>{infra.hw_type || "-"}</p>
                                    </div>

                                    {infra.hw_type === "Dedicated" && (
                                        <>
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
                                            {infra.hw_rack_provided === "Yes" && (
                                                <div className="doc-row">
                                                    <label>Rack Type</label>
                                                    <p>{infra.hw_rack_type || "-"}</p>
                                                </div>
                                            )}
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
                                        </>
                                    )}
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
                            <button type="button" className="edit-section-button" onClick={() => navigate("/ssldetails")}>Edit</button>
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
                            <button type="button" className="edit-section-button" onClick={() => navigate("/checklist")}>Edit</button>
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

        </>
    );
}

export default FormPreviewContent;