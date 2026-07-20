import "./HardwareDetails.css";
import Layout from "../components/Layout";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router-dom";

function HardwareDetails() {

  const navigate = useNavigate();

  function Nextpage() {
    navigate("/ssldetails");      
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

        <div className="form-row">
          <label>Hardware Type</label>

          <div className="radio-group">
            <label>
              <input type="radio" name="hardwareType" />
              Dedicated (provided by dept)
            </label>

            <label>
              <input type="radio" name="hardwareType" />
              Shared
            </label>
          </div>
        </div>

        <div className="form-row">
          <label>Name Make / Brand</label>

          <input
            type="text"
            placeholder="Enter Name Make / Brand"
          />
        </div>

        <div className="form-row">
          <label>Model Type</label>

          <input
            type="text"
            placeholder="Enter Model Type"
          />
        </div>

        <h3>Hardware Description</h3>

        <div className="two-column">

          <div className="form-row">
            <label>CPU</label>

            <input
              type="text"
              placeholder="Enter CPU Details"
            />
          </div>

          <div className="form-row">
            <label>RAM</label>

            <input
              type="text"
              placeholder="Enter RAM Details"
            />
          </div>

        </div>

        <div className="form-row">
          <label>HDD</label>

          <input
            type="text"
            placeholder="Enter HDD Details"
          />
        </div>

        <div className="form-row">

          <label>HBA Card</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="hbaCard" />
              Yes
            </label>

            <label>
              <input type="radio" name="hbaCard" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>Fiber Cable</label>

          <input
            type="text"
            placeholder="Enter Fiber Cable Details"
          />

        </div>

        <div className="form-row">

          <label>Power Consumption Details (Amp / watt)</label>

          <input
            type="text"
            placeholder="Enter Power Consumption Details"
          />

        </div>

        <div className="form-row">

          <label>Rack Provided</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="rackProvided" />
              Yes
            </label>

            <label>
              <input type="radio" name="rackProvided" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>Type (if Yes)</label>

          <input
            type="text"
            placeholder="Example: Server / Network"
          />

        </div>

        <div className="form-row">

          <label>Copy of Insurance</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="insuranceCopy" />
              Yes
            </label>

            <label>
              <input type="radio" name="insuranceCopy" />
              No
            </label>

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Antivirus Type</label>

            <input
              type="text"
              placeholder="Enter Antivirus Type"
            />

          </div>

          <div className="form-row">

            <label>Expiry Date</label>

            <input
              type="date"
            />

          </div>

        </div>

        <div className="form-row">

          <label>PO attached</label>

          <div className="radio-group">

            <label>
              <input type="radio" name="poAttached" />
              Yes
            </label>

            <label>
              <input type="radio" name="poAttached" />
              No
            </label>

          </div>

        </div>

        <div className="form-row">

          <label>Any Special Hosting Environment required</label>

          <textarea
            rows="4"
            placeholder="Enter Hosting Environment Details"
          ></textarea>

        </div>

                <h2 className="section-heading">
          Facility Management being provided by (In case of Dedicated Hardware)
        </h2>

        <div className="two-column">

          <div className="form-row">

            <label>Hardware Under FMS</label>

            <div className="radio-group">
              <label>
                <input type="radio" name="hardwareFms" />
                Yes
              </label>

              <label>
                <input type="radio" name="hardwareFms" />
                No
              </label>
            </div>

          </div>

          <div className="form-row">

            <label>Hardware Under AMC</label>

            <div className="radio-group">
              <label>
                <input type="radio" name="hardwareAmc" />
                Yes
              </label>

              <label>
                <input type="radio" name="hardwareAmc" />
                No
              </label>
            </div>

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Name of the Company / Agency (FMS)</label>

            <input
              type="text"
              placeholder="Enter Company / Agency Name"
            />

          </div>

          <div className="form-row">

            <label>Name of the Company / Agency (AMC)</label>

            <input
              type="text"
              placeholder="Enter Company / Agency Name"
            />

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Name of Contact Person (FMS)</label>

            <input
              type="text"
              placeholder="Enter Contact Person Name"
            />

          </div>

          <div className="form-row">

            <label>Name of Contact Person (AMC)</label>

            <input
              type="text"
              placeholder="Enter Contact Person Name"
            />

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Address of Contact Person (FMS)</label>

            <textarea
              rows="3"
              placeholder="Enter Address"
            ></textarea>

          </div>

          <div className="form-row">

            <label>Address of Contact Person (AMC)</label>

            <textarea
              rows="3"
              placeholder="Enter Address"
            ></textarea>

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Phone No. (Office) - FMS</label>

            <input
              type="text"
              placeholder="Enter Office Phone Number"
            />

          </div>

          <div className="form-row">

            <label>Phone No. (Office) - AMC</label>

            <input
              type="text"
              placeholder="Enter Office Phone Number"
            />

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Phone No. (Mobile) - FMS</label>

            <input
              type="text"
              placeholder="Enter Mobile Number"
            />

          </div>

          <div className="form-row">

            <label>Phone No. (Mobile) - AMC</label>

            <input
              type="text"
              placeholder="Enter Mobile Number"
            />

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>e-Mail Address (FMS)</label>

            <input
              type="email"
              placeholder="Enter Email Address"
            />

          </div>

          <div className="form-row">

            <label>e-Mail Address (AMC)</label>

            <input
              type="email"
              placeholder="Enter Email Address"
            />

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Contract Expiry Date (FMS)</label>

            <input
              type="date"
            />

          </div>

          <div className="form-row">

            <label>Contract Expiry Date (AMC)</label>

            <input
              type="date"
            />

          </div>

        </div>

        <div className="two-column">

          <div className="form-row">

            <label>Contract Copies attached (FMS)</label>

            <div className="radio-group">

              <label>
                <input type="radio" name="contractCopyFms" />
                Yes
              </label>

              <label>
                <input type="radio" name="contractCopyFms" />
                No
              </label>

            </div>

          </div>

          <div className="form-row">

            <label>Contract Copies attached (AMC)</label>

            <div className="radio-group">

              <label>
                <input type="radio" name="contractCopyAmc" />
                Yes
              </label>

              <label>
                <input type="radio" name="contractCopyAmc" />
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
      />

    </Layout>

  );
}

export default HardwareDetails;