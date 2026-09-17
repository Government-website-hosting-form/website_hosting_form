import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiGet, apiPost, apiPut } from "../api";

function Checklist() {
  const navigate = useNavigate();
  const { ids, setId } = useFormContext();
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // used to load existing checklist answers when this page is revisited 
  //useEffect runs every time remounting happens 
  useEffect(() => {
    async function loadExisting() {
      if (!ids.checklistId) return;
      try {
        const data = await apiGet(`/checklist/${ids.checklistId}`);
        if (data) setAnswers(data);
      } catch (err) {
        console.error("Could not load saved checklist:", err);
      }
    }
    loadExisting();
  }, [ids.checklistId]);

  function handleAnswer(e) {
    const name = e.target.name;
    const value = e.target.value;
    setAnswers({ ...answers, [name]: value });
  }

  function validateForm() {
    if (!answers.captcha_lockout_login) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.input_validation_client_server) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.parameterized_queries_sql_injection) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.audit_action_trails) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.pre_post_auth_session_cookies) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.access_control_list_acl) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.no_direct_thirdparty_reference) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.trusted_thirdparty_components) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.encrypted_critical_data) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.restrict_public_critical_info) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.password_hashing_sha) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.change_forgot_password_module) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.password_policy_compliance) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.post_method_usage) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.proper_error_handling) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.csrf_token_protection) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.no_file_upload_public) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.files_stored_in_database) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.unique_unpredictable_ids) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.session_timeout) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.admin_url_restricted_ip) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.thirdparty_links_new_tab) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.disable_trace_put_delete) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.email_image_format) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.disable_directory_listing) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.autocomplete_off_forms) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.prevent_page_caching) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.logout_button_all_pages) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.restricted_min_access) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.latest_nonvulnerable_versions) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.audit_trail_system_logs) {
      setError("Please select an option for all the fields.");
      return false;
    }

    if (!answers.regular_backups) {
      setError("Please select an option for all the fields.");
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
      const payload = { app_id: ids.appId, ...answers };
      if (ids.checklistId) {
        await apiPut(`/checklist/${ids.checklistId}`, payload);
      } else {
        const res = await apiPost("/checklist", payload);
        setId("checklistId", res.id);
      }
      navigate("/previewdetails");
    } catch (err) {
      console.error(err);
      setError("Could not save the Checklist.");
    } finally {
      setSaving(false);
    }
  }

  function Backpage() {
    navigate("/ssldetails");
  }

  return (
    <Layout>
      <h2 className="section-heading">
        Website Hosting Request Form Checklist for Secure Code Programming in Applications (Annexure 8)
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">8.1</span>
          <h3>Action Item(s)</h3>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>1.</strong> Implement CAPTCHA on all entry forms in PUBLIC pages. Implement CAPTCHA or account-lockout feature on the login form. [Alpha-numeric CAPTCHA with minimum 6 characters]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="captcha_lockout_login" value="YES" checked={answers.captcha_lockout_login === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="captcha_lockout_login" value="NO" checked={answers.captcha_lockout_login === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="captcha_lockout_login" value="NA" checked={answers.captcha_lockout_login === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>2.</strong> Implement proper validations on all input parameters in client and serverside (both). [White-listing of charactersis preferred over Black-listing]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="input_validation_client_server" value="YES" checked={answers.input_validation_client_server === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="input_validation_client_server" value="NO" checked={answers.input_validation_client_server === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="input_validation_client_server" value="NA" checked={answers.input_validation_client_server === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>3.</strong> Use parameterized queries or Stored-procedures to query output from databases, instead of inline SQL queries [Prevention of SQL Injection]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="parameterized_queries_sql_injection" value="YES" checked={answers.parameterized_queries_sql_injection === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="parameterized_queries_sql_injection" value="NO" checked={answers.parameterized_queries_sql_injection === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="parameterized_queries_sql_injection" value="NA" checked={answers.parameterized_queries_sql_injection === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>4.</strong> Implement proper Audit/Action Trails in applications
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="audit_action_trails" value="YES" checked={answers.audit_action_trails === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="audit_action_trails" value="NO" checked={answers.audit_action_trails === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="audit_action_trails" value="NA" checked={answers.audit_action_trails === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>5.</strong> Use different Pre and Post authentication session values/Authentication-cookies
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="pre_post_auth_session_cookies" value="YES" checked={answers.pre_post_auth_session_cookies === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="pre_post_auth_session_cookies" value="NO" checked={answers.pre_post_auth_session_cookies === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="pre_post_auth_session_cookies" value="NA" checked={answers.pre_post_auth_session_cookies === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>6.</strong> Implement proper Access matrix (Access Control List-ACL)to prevent un-authorized access to resources/pages/forms in website [Prevention of Privilege escalation and restrict in of accessto authorized/authenticated content ]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="access_control_list_acl" value="YES" checked={answers.access_control_list_acl === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="access_control_list_acl" value="NO" checked={answers.access_control_list_acl === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="access_control_list_acl" value="NA" checked={answers.access_control_list_acl === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>7.</strong> Do not reference components(such as javascripts,stylesheets etc.) directly third-party sites. [They may be downloaded and self-referenced in website]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="no_direct_thirdparty_reference" value="YES" checked={answers.no_direct_thirdparty_reference === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="no_direct_thirdparty_reference" value="NO" checked={answers.no_direct_thirdparty_reference === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="no_direct_thirdparty_reference" value="NA" checked={answers.no_direct_thirdparty_reference === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>8.</strong> Use third-Party components from trusted source only. [Components with known vulnerabilities are not recommended.]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="trusted_thirdparty_components" value="YES" checked={answers.trusted_thirdparty_components === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="trusted_thirdparty_components" value="NO" checked={answers.trusted_thirdparty_components === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="trusted_thirdparty_components" value="NA" checked={answers.trusted_thirdparty_components === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>9.</strong> Store critical data such as PAN number,MobileNumber,Aadhar Card number etc. in encrypted form in the database. [Hashing of sensitive information is preferred over encryption, unless required to be decrypted]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="encrypted_critical_data" value="YES" checked={answers.encrypted_critical_data === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="encrypted_critical_data" value="NO" checked={answers.encrypted_critical_data === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="encrypted_critical_data" value="NA" checked={answers.encrypted_critical_data === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>10.</strong> Prevent critical information from public access by any mean [Critical information like credit card number, account number, aadhar number etc. should be restricted to authorized persons only. If such information is stored in static files such as excel,pdf etc., sufficient measures should be taken so that it is not accessible to unauthorized persons or in public.]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="restrict_public_critical_info" value="YES" checked={answers.restrict_public_critical_info === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="restrict_public_critical_info" value="NO" checked={answers.restrict_public_critical_info === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="restrict_public_critical_info" value="NA" checked={answers.restrict_public_critical_info === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>11.</strong> Hash the password before it is relayed over network, or is stored in database. [During login, password should be salt-hashed using SHA-256/512. However, it should be stored as plain hash (SHA-256/512) in database.On every login attempt, new salt should be used, and it should be generated from server-side only]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="password_hashing_sha" value="YES" checked={answers.password_hashing_sha === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="password_hashing_sha" value="NO" checked={answers.password_hashing_sha === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="password_hashing_sha" value="NA" checked={answers.password_hashing_sha === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>12.</strong> Implement Change Password and Forgot password module in applications [not required in applications, using LDAP for authentication]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="change_forgot_password_module" value="YES" checked={answers.change_forgot_password_module === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="change_forgot_password_module" value="NO" checked={answers.change_forgot_password_module === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="change_forgot_password_module" value="NA" checked={answers.change_forgot_password_module === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>13.</strong> Comply with Password Policy, wherever passwords are being used.
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="password_policy_compliance" value="YES" checked={answers.password_policy_compliance === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="password_policy_compliance" value="NO" checked={answers.password_policy_compliance === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="password_policy_compliance" value="NA" checked={answers.password_policy_compliance === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>14.</strong> Use Post methods to pass parameters as values from one page/website to another. [GET methods should be avoided]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="post_method_usage" value="YES" checked={answers.post_method_usage === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="post_method_usage" value="NO" checked={answers.post_method_usage === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="post_method_usage" value="NA" checked={answers.post_method_usage === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>15.</strong> Implement proper error-handling. [System/application errors should not be displayed to viewer]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="proper_error_handling" value="YES" checked={answers.proper_error_handling === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="proper_error_handling" value="NO" checked={answers.proper_error_handling === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="proper_error_handling" value="NA" checked={answers.proper_error_handling === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>16.</strong> Implementtoken-based system that changes on every web request in application,to prevent CSRF. [CSRF Guard or Anti-forgery tokens can be implemented in non critical applications. Websites using payment-gateways etc. are categorized in critical websites.]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="csrf_token_protection" value="YES" checked={answers.csrf_token_protection === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="csrf_token_protection" value="NO" checked={answers.csrf_token_protection === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="csrf_token_protection" value="NA" checked={answers.csrf_token_protection === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>17.</strong> Do not implement File upload in public modules
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="no_file_upload_public" value="YES" checked={answers.no_file_upload_public === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="no_file_upload_public" value="NO" checked={answers.no_file_upload_public === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="no_file_upload_public" value="NA" checked={answers.no_file_upload_public === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>18.</strong> Store uploaded files in database,rather than storing them in file system [Files stored in database cannot be executed directly, hence this is more secure than storing them in file system.]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="files_stored_in_database" value="YES" checked={answers.files_stored_in_database === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="files_stored_in_database" value="NO" checked={answers.files_stored_in_database === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="files_stored_in_database" value="NA" checked={answers.files_stored_in_database === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>19.</strong> Generate unique, un-predictable and non-sequential receipt numbers/acknowledgement numbers/application numbers/roll numbers/File-names etc. It is preferable that strong algorithm be used to generate such numbers.
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="unique_unpredictable_ids" value="YES" checked={answers.unique_unpredictable_ids === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="unique_unpredictable_ids" value="NO" checked={answers.unique_unpredictable_ids === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="unique_unpredictable_ids" value="NA" checked={answers.unique_unpredictable_ids === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>20.</strong> Implement proper Session Timeout [Logged-In user should be logged-out after a specific period(say 20 minutes) of inactivity]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="session_timeout" value="YES" checked={answers.session_timeout === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="session_timeout" value="NO" checked={answers.session_timeout === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="session_timeout" value="NA" checked={answers.session_timeout === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>21.</strong> Assure admin/Super-Admin URL's is/are accessible from restricted IP's only [For this, segregate public URL from Admin/Super-Admin module. Public modules and Admin/Super-Admin modules should be deployed on separate URL's. Admin/Super-Admin URL's should be accessible from restricted IP's only. It is preferable to allow access for Admin/Super-Admin modules through VPN]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="admin_url_restricted_ip" value="YES" checked={answers.admin_url_restricted_ip === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="admin_url_restricted_ip" value="NO" checked={answers.admin_url_restricted_ip === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="admin_url_restricted_ip" value="NA" checked={answers.admin_url_restricted_ip === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">8.2</span>
          <h3>Other Action Item(s)</h3>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>1.</strong> Assure third-Party links/page(partial/full) open in different tab, with a disclaimer.
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="thirdparty_links_new_tab" value="YES" checked={answers.thirdparty_links_new_tab === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="thirdparty_links_new_tab" value="NO" checked={answers.thirdparty_links_new_tab === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="thirdparty_links_new_tab" value="NA" checked={answers.thirdparty_links_new_tab === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>2.</strong> Disable Trace/PUT/DELETE and other non-required methods in application/web-server.
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="disable_trace_put_delete" value="YES" checked={answers.disable_trace_put_delete === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="disable_trace_put_delete" value="NO" checked={answers.disable_trace_put_delete === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="disable_trace_put_delete" value="NA" checked={answers.disable_trace_put_delete === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>3.</strong> Assure that Email addresses, where ever used, are in form of an image. [Alternatively, replace '@' with [at] and '.' with [dot] in email addresses]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="email_image_format" value="YES" checked={answers.email_image_format === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="email_image_format" value="NO" checked={answers.email_image_format === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="email_image_format" value="NA" checked={answers.email_image_format === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>4.</strong> Disable directory listing
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="disable_directory_listing" value="YES" checked={answers.disable_directory_listing === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="disable_directory_listing" value="NO" checked={answers.disable_directory_listing === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="disable_directory_listing" value="NA" checked={answers.disable_directory_listing === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>5.</strong> Set 'Auto Complete' off for textboxes in forms
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="autocomplete_off_forms" value="YES" checked={answers.autocomplete_off_forms === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="autocomplete_off_forms" value="NO" checked={answers.autocomplete_off_forms === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="autocomplete_off_forms" value="NA" checked={answers.autocomplete_off_forms === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>6.</strong> Prevent pages from being stored in history/cache. [Each time that the user tries to fetch a page, it should request server to serve with a fresh copy of the page]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="prevent_page_caching" value="YES" checked={answers.prevent_page_caching === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="prevent_page_caching" value="NO" checked={answers.prevent_page_caching === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="prevent_page_caching" value="NA" checked={answers.prevent_page_caching === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>7.</strong> Implement Logout buttons in all authenticated pages
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="logout_button_all_pages" value="YES" checked={answers.logout_button_all_pages === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="logout_button_all_pages" value="NO" checked={answers.logout_button_all_pages === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="logout_button_all_pages" value="NA" checked={answers.logout_button_all_pages === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

      </div>

      <div className="form-section">
        <div className="section-header">
          <span className="section-badge">8.3</span>
          <h3>Implementation Guidelines</h3>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>1.</strong> Restrict each application for minimum access(only required access) [Allow access of application for restricted network access. Websites, those are to be used in local-network, should not be accessible from any other network. For exceptional cases, VPN may be used. Websites,those are required to be accessed from within the country,should be restricted for access on Indian ISP's ONLY.]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="restricted_min_access" value="YES" checked={answers.restricted_min_access === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="restricted_min_access" value="NO" checked={answers.restricted_min_access === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="restricted_min_access" value="NA" checked={answers.restricted_min_access === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>2.</strong> Use the latest and non-vulnerable versions of Application Server (IIS/Apache etc.), query etc.
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="latest_nonvulnerable_versions" value="YES" checked={answers.latest_nonvulnerable_versions === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="latest_nonvulnerable_versions" value="NO" checked={answers.latest_nonvulnerable_versions === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="latest_nonvulnerable_versions" value="NA" checked={answers.latest_nonvulnerable_versions === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>3.</strong> Enable audit-trails and system logs on server [e.g.: Web-Accesslogs, Application Logs, Security Logs etc.]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="audit_trail_system_logs" value="YES" checked={answers.audit_trail_system_logs === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="audit_trail_system_logs" value="NO" checked={answers.audit_trail_system_logs === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="audit_trail_system_logs" value="NA" checked={answers.audit_trail_system_logs === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

        <div className="checklist-row">
          <div className="question required">
            <strong>4.</strong> Take regular backups of data and application [Sufficient arrangements should be made to take proper and regular backups of database,application and other related objects/components, for retrieval on undesirable circumstances. It is preferable to maintain a set of last 5 backups. It is advised to store backups on hard-drive/tape-disks/SAN storage. Networked servers/machines should be avoided for this activity]
          </div>
          <div className="radio-group">
            <label>
              <input type="radio" name="regular_backups" value="YES" checked={answers.regular_backups === "YES"} onChange={handleAnswer} />
              YES
            </label>
            <label>
              <input type="radio" name="regular_backups" value="NO" checked={answers.regular_backups === "NO"} onChange={handleAnswer} />
              NO
            </label>
            <label>
              <input type="radio" name="regular_backups" value="NA" checked={answers.regular_backups === "NA"} onChange={handleAnswer} />
              Not Applicable
            </label>
          </div>
        </div>

      </div>

      <FormButtons
        showBack={true}
        onBack={Backpage}
        onNext={Nextpage}
        saving={saving}
        disabled={saving}
      />
    </Layout>
  );
}

export default Checklist;