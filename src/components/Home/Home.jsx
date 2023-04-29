import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useData } from "../../Contexts/DataContext";
// import { useAuth } from '../../Contexts/AdminContext';
import Navbar from "../Navbar/Navbar";
import "./Home.css";

const Home = () => {
  const [trips, setTrips] = React.useState([]);
  const { setSearchTrips } = useData();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (e.target.trip.value === "" && e.target.date.value === "") {
      Swal.fire({
        title: "Can not search!",
        text: "Please select a trip name or date.",
        icon: "error",
      });
    } else if (e.target.trip.value === "") {
      Swal.fire("Warning!", "Please select a trip.", "warning");
    } else if (e.target.date.value === "") {
      Swal.fire("Warning!", "Please select a date.", "warning");
    } else {
      setSearchTrips({
        trip: e.target.trip.value,
        date: e.target.date.value,
      });
      navigate("/search");
    }
  };
  React.useEffect(() => {
    setLoading(true);
    fetch("https://bus-counter-backend-production.up.railway.app/trips/all")
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="background">
      <div className="overlay">
        <div className="custom-container">
          <Navbar />
          <div className="container-center">
            <form className="home-form py-5" onSubmit={handleSubmit}>
              {/* content should be here */}
              <h1 className="text-white mb-5 text-center text-uppercase">
                Book a Trip
              </h1>

              <select name="trip" className="form-control mb-3">
                <option
                  hidden
                  className="text-primary"
                  placeholder="trip"
                  value=""
                >
                  নবীন বরণ গাড়ির ট্রিপ
                </option>
                {loading ? (
                  <option className="spinner-border" role="status">
                    loading trips...
                  </option>
                ) : (
                  trips?.map((trip) => (
                    <option key={trip._id} value={trip.trip_name}>
                      {trip.trip_name}
                    </option>
                  ))
                )}
              </select>
              <span className="text-light">তারিখ নির্ধারণ করুন</span>
              <input
                placeholder="Date"
                name="date"
                type="date"
                className="form-control"
              />

              <button className="btn btn-white form-control mt-4">
                ট্রিপ খুজুন
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
