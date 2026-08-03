import { useState } from "react";
import "./HardwareDetails.css";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPut } from "../api";
import { validateEmail, validateMobile, validatePhone, validateText } from "../helpers/Validation";

const initialState = {
  hw_type: "",
  hw_brand: "",
  hw_model: "",
  hw_cpu: "",
  hw_ram: "",
  hw_hdd: "",
  hw_hba_card: "",
  hw_fiber_cable: "",
  hw_power: "",
  hw_rack_provided: "",
  hw_rack_type: "",
  hw_insurance: "",
  hw_antivirus_name: "",
  hw_antivirus_expiry: "",
  hw_po_attached: "",
  hw_special_env: "",

  hw_fms: "",
  hw_fms_company: "",
  hw_fms_contact_person: "",
  hw_fms_address: "",
  hw_fms_phone_office: "",
  hw_fms_phone_mobile: "",
  hw_fms_email: "",

  hw_fms_contract_expiry: "",
  hw_fms_contract_attached: "",

  hw_amc: "",
  hw_amc_company: "",
  hw_amc_contact_person: "",
  hw_amc_address: "",
  hw_amc_phone_office: "",
  hw_amc_phone_mobile: "",
  hw_amc_email: "",

  hw_amc_contract_expiry: "",
  hw_amc_contract_attached: "",
};

function HardwareDetails() {
  const navigate = useNavigate();
  const { ids } = useFormContext();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};

    const brandError = validateText(form.hw_brand, 100);
    if (brandError) newErrors.hw_brand = brandError;

    const fmsCompanyError = validateText(form.hw_fms_company, 100);
    if (fmsCompanyError) newErrors.hw_fms_company = fmsCompanyError;

    const amcCompanyError = validateText(form.hw_amc_company, 100);
    if (amcCompanyError) newErrors.hw_amc_company = amcCompanyError;

    const fmsContactError = validateText(form.hw_fms_contact_person, 100);
    if (fmsContactError) newErrors.hw_fms_contact_person = fmsContactError;

    const amcContactError = validateText(form.hw_amc_contact_person, 100);
    if (amcContactError) newErrors.hw_amc_contact_person = amcContactError;

    const fmsPhoneOfficeError = validatePhone(form.hw_fms_phone_office);
    if (fmsPhoneOfficeError) newErrors.hw_fms_phone_office = fmsPhoneOfficeError;

    const amcPhoneOfficeError = validatePhone(form.hw_amc_phone_office);
    if (amcPhoneOfficeError) newErrors.hw_amc_phone_office = amcPhoneOfficeError;

    const fmsPhoneMobileError = validateMobile(form.hw_fms_phone_mobile);
    if (fmsPhoneMobileError) newErrors.hw_fms_phone_mobile = fmsPhoneMobileError;

    const amcPhoneMobileError = validateMobile(form.hw_amc_phone_mobile);
    if (amcPhoneMobileError) newErrors.hw_amc_phone_mobile = amcPhoneMobileError;

    const fmsEmailError = validateEmail(form.hw_fms_email);
    if (fmsEmailError) newErrors.hw_fms_email = fmsEmailError;

    const amcEmailError = validateEmail(form.hw_amc_email);
    if (amcEmailError) newErrors.hw_amc_email = amcEmailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function Nextpage() {
    if (!validateForm()) return;
    setError("");
    if (!ids.infraId) {
      setError("Infrastructure record not found yet — please go back and fill Infra Details first.");
      return;
    }
    setSaving(true);
    try {
      await apiPut(`/infra/${ids.infraId}`, form);
      navigate("/ssldetails");
    } catch (err) {
      console.error(err);
      setError("Could not save Hardware Details.");
    } finally {
      setSaving(false);
    }
  }

  function Backpage() {
    navigate("/infradetails");
  }

  return (
    <Layout>
      <div className="form-container">
        <h2 className="section-heading">Hardware Details (Annexure-6)</h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-section">
          <div className="section-header">
            <span className="section-badge">6.1</span>
            <h3>Hardware Specifications (In case of dedicated h/w provided)</h3>
          </div>

          <div className="form-section-grid">
            <div className="form-row full-width">
              <label>Hardware Type</label>
              <div className="hw-radio-group">
                <label>
                  <input type="radio" name="hw_type" value="Dedicated" checked={form.hw_type === "Dedicated"} onChange={handleChange} />
                  Dedicated (provided by dept)
                </label>
                <label>
                  <input type="radio" name="hw_type" value="Shared" checked={form.hw_type === "Shared"} onChange={handleChange} />
                  Shared
                </label>
              </div>
            </div>

            {form.hw_type === "Dedicated" && (
              <>
                <div className="form-row">
                  <label>Name Make / Brand</label>
                  <input type="text" name="hw_brand" value={form.hw_brand} onChange={handleChange} placeholder="Enter Name Make / Brand" />
                  {errors.hw_brand && <p className="error-message">{errors.hw_brand}</p>}
                </div>

                <div className="form-row">
                  <label>Model Type</label>
                  <input type="text" name="hw_model" value={form.hw_model} onChange={handleChange} placeholder="Enter Model Type" />
                </div>

                <div className="form-row">
                  <label>CPU</label>
                  <input type="text" name="hw_cpu" value={form.hw_cpu} onChange={handleChange} placeholder="Enter CPU Details" />
                </div>

                <div className="form-row">
                  <label>RAM</label>
                  <input type="text" name="hw_ram" value={form.hw_ram} onChange={handleChange} placeholder="Enter RAM Details" />
                </div>

                <div className="form-row">
                  <label>HDD</label>
                  <input type="text" name="hw_hdd" value={form.hw_hdd} onChange={handleChange} placeholder="Enter HDD Details" />
                </div>

                <div className="form-row">
                  <label>HBA Card</label>
                  <div className="hw-radio-group">
                    <label>
                      <input type="radio" name="hw_hba_card" value="Yes" checked={form.hw_hba_card === "Yes"} onChange={handleChange} />
                      Yes
                    </label>
                    <label>
                      <input type="radio" name="hw_hba_card" value="No" checked={form.hw_hba_card === "No"} onChange={handleChange} />
                      No
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label>Fiber Cable</label>
                  <input type="text" name="hw_fiber_cable" value={form.hw_fiber_cable} onChange={handleChange} placeholder="Enter Fiber Cable Details" />
                </div>

                <div className="form-row">
                  <label>Power Consumption Details (Amp / watt)</label>
                  <input type="text" name="hw_power" value={form.hw_power} onChange={handleChange} placeholder="Enter Power Consumption Details" />
                </div>

                <div className="form-row">
                  <label>Rack Provided</label>
                  <div className="hw-radio-group">
                    <label>
                      <input type="radio" name="hw_rack_provided" value="Yes" checked={form.hw_rack_provided === "Yes"} onChange={handleChange} />
                      Yes
                    </label>
                    <label>
                      <input type="radio" name="hw_rack_provided" value="No" checked={form.hw_rack_provided === "No"} onChange={handleChange} />
                      No
                    </label>
                  </div>
                </div>

                {form.hw_rack_provided === "Yes" && (
                  <div className="form-row">
                    <label>Type</label>
                    <div className="hw-radio-group">
                      <label>
                        <input type="radio" name="hw_rack_type" value="Server" checked={form.hw_rack_type === "Server"} onChange={handleChange} />
                        Server
                      </label>
                      <label>
                        <input type="radio" name="hw_rack_type" value="Network" checked={form.hw_rack_type === "Network"} onChange={handleChange} />
                        Network
                      </label>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <label>Copy of Insurance</label>
                  <div className="hw-radio-group">
                    <label>
                      <input type="radio" name="hw_insurance" value="Yes" checked={form.hw_insurance === "Yes"} onChange={handleChange} />
                      Yes
                    </label>
                    <label>
                      <input type="radio" name="hw_insurance" value="No" checked={form.hw_insurance === "No"} onChange={handleChange} />
                      No
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label>Antivirus Type</label>
                  <input type="text" name="hw_antivirus_name" value={form.hw_antivirus_name} onChange={handleChange} placeholder="Enter Antivirus Type" />
                </div>

                <div className="form-row">
                  <label>Expiry Date</label>
                  <input type="date" name="hw_antivirus_expiry" value={form.hw_antivirus_expiry} onChange={handleChange} />
                </div>

                <div className="form-row">
                  <label>PO attached</label>
                  <div className="hw-radio-group">
                    <label>
                      <input type="radio" name="hw_po_attached" value="Yes" checked={form.hw_po_attached === "Yes"} onChange={handleChange} />
                      Yes
                    </label>
                    <label>
                      <input type="radio" name="hw_po_attached" value="No" checked={form.hw_po_attached === "No"} onChange={handleChange} />
                      No
                    </label>
                  </div>
                </div>

                <div className="form-row full-width">
                  <label>Any Special Hosting Environment required</label>
                  <textarea rows="4" name="hw_special_env" value={form.hw_special_env} onChange={handleChange} placeholder="Enter Hosting Environment Details"></textarea>
                </div>
              </>
            )}
          </div>
        </div>

        {form.hw_type === "Dedicated" && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-badge">6.2</span>
              <h3>Facility Management being provided by (In case of Dedicated Hardware)</h3>
            </div>

            <div className="hw-table">
              <div className="hw-table-header">
                <div></div>
                <div>FMS (Facility Management Services)</div>
                <div>AMC (Annual Maintenance Contract)</div>
              </div>

              <div className="hw-table-row">
                <label>Hardware Under FMS/AMC</label>
                <div className="hw-radio-group">
                  <label>
                    <input type="radio" name="hw_fms" value="Yes" checked={form.hw_fms === "Yes"} onChange={handleChange} />
                    Yes
                  </label>
                  <label>
                    <input type="radio" name="hw_fms" value="No" checked={form.hw_fms === "No"} onChange={handleChange} />
                    No
                  </label>
                </div>
                <div className="hw-radio-group">
                  <label>
                    <input type="radio" name="hw_amc" value="Yes" checked={form.hw_amc === "Yes"} onChange={handleChange} />
                    Yes
                  </label>
                  <label>
                    <input type="radio" name="hw_amc" value="No" checked={form.hw_amc === "No"} onChange={handleChange} />
                    No
                  </label>
                </div>
              </div>

              <div className="hw-table-row">
                <label>Name of the Company / Agency</label>
                <div>
                  <input type="text" placeholder="Enter Company / Agency Name" name="hw_fms_company" value={form.hw_fms_company} onChange={handleChange} />
                  {errors.hw_fms_company && <p className="error-message">{errors.hw_fms_company}</p>}
                </div>
                <div>
                  <input type="text" placeholder="Enter Company / Agency Name" name="hw_amc_company" value={form.hw_amc_company} onChange={handleChange} />
                  {errors.hw_amc_company && <p className="error-message">{errors.hw_amc_company}</p>}
                </div>
              </div>

              <div className="hw-table-row">
                <label>Name of Contact Person</label>
                <div>
                  <input type="text" placeholder="Enter Contact Person Name" name="hw_fms_contact_person" value={form.hw_fms_contact_person} onChange={handleChange} />
                  {errors.hw_fms_contact_person && <p className="error-message">{errors.hw_fms_contact_person}</p>}
                </div>
                <div>
                  <input type="text" placeholder="Enter Contact Person Name" name="hw_amc_contact_person" value={form.hw_amc_contact_person} onChange={handleChange} />
                  {errors.hw_amc_contact_person && <p className="error-message">{errors.hw_amc_contact_person}</p>}
                </div>
              </div>

              <div className="hw-table-row">
                <label>Address of Contact Person</label>
                <input type="text" placeholder="Enter Address" name="hw_fms_address" value={form.hw_fms_address} onChange={handleChange} />
                <input type="text" placeholder="Enter Address" name="hw_amc_address" value={form.hw_amc_address} onChange={handleChange} />
              </div>

              <div className="hw-table-row">
                <label>Phone No. (Office)</label>
                <div>
                  <input type="text" placeholder="Enter Office Phone No." name="hw_fms_phone_office" value={form.hw_fms_phone_office} onChange={handleChange} />
                  {errors.hw_fms_phone_office && <p className="error-message">{errors.hw_fms_phone_office}</p>}
                </div>
                <div>
                  <input type="text" placeholder="Enter Office Phone No." name="hw_amc_phone_office" value={form.hw_amc_phone_office} onChange={handleChange} />
                  {errors.hw_amc_phone_office && <p className="error-message">{errors.hw_amc_phone_office}</p>}
                </div>
              </div>

              <div className="hw-table-row">
                <label>Phone No. (Mobile)</label>
                <div>
                  <input type="text" placeholder="Enter Mobile Phone No." name="hw_fms_phone_mobile" value={form.hw_fms_phone_mobile} onChange={handleChange} />
                  {errors.hw_fms_phone_mobile && <p className="error-message">{errors.hw_fms_phone_mobile}</p>}
                </div>
                <div>
                  <input type="text" placeholder="Enter Mobile Phone No." name="hw_amc_phone_mobile" value={form.hw_amc_phone_mobile} onChange={handleChange} />
                  {errors.hw_amc_phone_mobile && <p className="error-message">{errors.hw_amc_phone_mobile}</p>}
                </div>
              </div>

              <div className="hw-table-row">
                <label>e-Mail Address</label>
                <div>
                  <input type="email" placeholder="Enter e-Mail Address" name="hw_fms_email" value={form.hw_fms_email} onChange={handleChange} />
                  {errors.hw_fms_email && <p className="error-message">{errors.hw_fms_email}</p>}
                </div>
                <div>
                  <input type="email" placeholder="Enter e-Mail Address" name="hw_amc_email" value={form.hw_amc_email} onChange={handleChange} />
                  {errors.hw_amc_email && <p className="error-message">{errors.hw_amc_email}</p>}
                </div>
              </div>
              <div className="hw-table-row">
                <label>Contract Expiry Date</label>
                <input type="date" name="hw_fms_contract_expiry" value={form.hw_fms_contract_expiry} onChange={handleChange} />
                <input type="date" name="hw_amc_contract_expiry" value={form.hw_amc_contract_expiry} onChange={handleChange} />
              </div>

              <div className="hw-table-row">
                <label>Contract Copies attached</label>
                <div className="hw-radio-group">
                  <label>
                    <input type="radio" name="hw_fms_contract_attached" value="Yes" checked={form.hw_fms_contract_attached === "Yes"} onChange={handleChange} />
                    Yes
                  </label>
                  <label>
                    <input type="radio" name="hw_fms_contract_attached" value="No" checked={form.hw_fms_contract_attached === "No"} onChange={handleChange} />
                    No
                  </label>
                </div>
                <div className="hw-radio-group">
                  <label>
                    <input type="radio" name="hw_amc_contract_attached" value="Yes" checked={form.hw_amc_contract_attached === "Yes"} onChange={handleChange} />
                    Yes
                  </label>
                  <label>
                    <input type="radio" name="hw_amc_contract_attached" value="No" checked={form.hw_amc_contract_attached === "No"} onChange={handleChange} />
                    No
                  </label>
                </div>
              </div>
            </div>


          </div>
        )}
      </div>

      <FormButtons
        showBack={true}
        onBack={Backpage}
        onNext={Nextpage}
        disabled={saving} saving={saving}
      />
    </Layout>
  );
}

export default HardwareDetails;