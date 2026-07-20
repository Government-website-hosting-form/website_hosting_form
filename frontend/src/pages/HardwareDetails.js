import { useState } from "react";
import "./HardwareDetails.css";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { apiPut } from "../api";

const initialState = {
  hw_type: "Shared",
  hw_brand: "",
  hw_model: "",
  hw_cpu: "",
  hw_ram: "",
  hw_hdd: "",
  hw_hba_card: "No",
  hw_fiber_cable: "",
  hw_power: "",
  hw_rack_provided: "No",
  hw_rack_type: "Server",
  hw_insurance: "No",
  hw_antivirus_name: "",
  hw_antivirus_expiry: "",
  hw_po_attached: "No",
  hw_special_env: "",
  hw_fms: "No",
  hw_amc: "No",
  hw_company: "",
  hw_contact_person: "",
  hw_address: "",
  hw_phone_office: "",
  hw_phone_mobile: "",
  hw_email: "",
  hw_contract_expiry: "",
  hw_contract_attached: "No",
};

function HardwareDetails() {

  const navigate = useNavigate();
  const { ids } = useFormContext();
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function Nextpage() {
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

        <h2 className="section-heading">
          Hardware Specifications (In case of dedicated h/w provided)
        </h2>

        {error && <p className="form-error">{error}</p>}

        <div className="form-row">
          <label>Hardware Type</label>

          <div className="radio-group">
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

        <div className="form-row">
          <label>Name Make / Brand</label>

          <input type="text" name="hw_brand" value={form.hw_brand} onChange={handleChange} placeholder="Enter Name Make / Brand" />
        </div>

        <div className="form-row">
          <label>Model Type</label>

          <input type="text" name="hw_model" value={form.hw_model} onChange={handleChange} placeholder="Enter Model Type" />
        </div>

        <h3>Hardware Description</h3>

        <div className="two-column">

          <div className="form-row">
            <label>CPU</label>

            <input type="text" name="hw_cpu" value={form.hw_cpu} onChange={handleChange} placeholder="Enter CPU Details" />
          </div>

          <div className="form-row">
            <label>RAM</label>

            <input type="text" name="hw_ram" value={form.hw_ram} onChange={handleChange} placeholder="Enter RAM Details" />
          </div>

        </div>

        <div className="form-row">
          <label>HDD</label>

          <input type="text" name="hw_hdd" value={form.hw_hdd} onChange={handleChange} placeholder="Enter HDD Details" />
        </div>

        <div className="form-row">

          <label>HBA Card</label>

          <div className="radio-group">

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

          <div className="radio-group">

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

        <div className="form-row">

          <label>Type (if Yes)</label>

          <div className="radio-group">
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

        <div className="form-row">

          <label>Copy of Insurance</label>

          <div className="radio-group">

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

        <div className="two-column">

          <div className="form-row">

            <label>Antivirus Type</label>

            <input type="text" name="hw_antivirus_name" value={form.hw_antivirus_name} onChange={handleChange} placeholder="Enter Antivirus Type" />

          </div>

          <div className="form-row">

            <label>Expiry Date</label>

            <input type="date" name="hw_antivirus_expiry" value={form.hw_antivirus_expiry} onChange={handleChange} />

          </div>

        </div>

        <div className="form-row">

          <label>PO attached</label>

          <div className="radio-group">

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

        <div className="form-row">

          <label>Any Special Hosting Environment required</label>

          <textarea rows="4" name="hw_special_env" value={form.hw_special_env} onChange={handleChange} placeholder="Enter Hosting Environment Details"></textarea>

        </div>

                <h2 className="section-heading">
          Facility Management being provided by (In case of Dedicated Hardware)
        </h2>

        <div className="two-column">

          <div className="form-row">

            <label>Hardware Under FMS</label>

            <div className="radio-group">
              <label>
                <input type="radio" name="hw_fms" value="Yes" checked={form.hw_fms === "Yes"} onChange={handleChange} />
                Yes
              </label>

              <label>
                <input type="radio" name="hw_fms" value="No" checked={form.hw_fms === "No"} onChange={handleChange} />
                No
              </label>
            </div>

          </div>

          <div className="form-row">

            <label>Hardware Under AMC</label>

            <div className="radio-group">
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

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Name of the Company / Agency</label>

            <input type="text" name="hw_company" value={form.hw_company} onChange={handleChange} placeholder="Enter Company / Agency Name" />

          </div>

          <div className="form-row">

            <label>Name of Contact Person</label>

            <input type="text" name="hw_contact_person" value={form.hw_contact_person} onChange={handleChange} placeholder="Enter Contact Person Name" />

          </div>

        </div>

        <div className="form-row">

          <label>Address of Contact Person</label>

          <textarea rows="3" name="hw_address" value={form.hw_address} onChange={handleChange} placeholder="Enter Address"></textarea>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Phone No. (Office)</label>

            <input type="text" name="hw_phone_office" value={form.hw_phone_office} onChange={handleChange} placeholder="Enter Office Phone Number" />

          </div>

          <div className="form-row">

            <label>Phone No. (Mobile)</label>

            <input type="text" name="hw_phone_mobile" value={form.hw_phone_mobile} onChange={handleChange} placeholder="Enter Mobile Number" />

          </div>

        </div>

        <div className="form-row">

          <label>e-Mail Address</label>

          <input type="email" name="hw_email" value={form.hw_email} onChange={handleChange} placeholder="Enter Email Address" />

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Contract Expiry Date</label>

            <input type="date" name="hw_contract_expiry" value={form.hw_contract_expiry} onChange={handleChange} />

          </div>

          <div className="form-row">

            <label>Contract Copies attached</label>

            <div className="radio-group">

              <label>
                <input type="radio" name="hw_contract_attached" value="Yes" checked={form.hw_contract_attached === "Yes"} onChange={handleChange} />
                Yes
              </label>

              <label>
                <input type="radio" name="hw_contract_attached" value="No" checked={form.hw_contract_attached === "No"} onChange={handleChange} />
                No
              </label>

            </div>

          </div>

        </div>

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
