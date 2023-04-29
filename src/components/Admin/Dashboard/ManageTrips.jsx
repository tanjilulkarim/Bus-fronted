import React from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const ManageTrips = () => {
  const [tripsModalShow, setTripsModalShow] = React.useState(false);
  const [dateModalShow, setDateModalShow] = React.useState(false);
  const [trips, setTrips] = React.useState([]);
  const [dateTrip, setDateTrip] = React.useState([]);

  const handleAddTripsToDate = (e) => {
    e.preventDefault();
    function tConvert(time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join("");
    }
    fetch(
      "https://bus-counter-backend-production.up.railway.app/trips/add/date",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // trip_name: e.target.trip.value,
          trip_time: tConvert(e.target.time.value),
          trip_date: e.target.date.value,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDateModalShow(false);
        setDateTrip((prev) => {
          const f = prev.find((item) => item.trip_date === e.target.date.value);
          if (f) {
            f?.trips.push({
              trip_name: e.target.trip.value,
              trip_time: tConvert(e.target.time.value),
            });
            return [...prev];
          } else {
            return [
              ...prev,
              {
                trip_date: e.target.date.value,
                trips: [
                  {
                    trip_name: e.target.trip.value,
                    trip_time: tConvert(e.target.time.value),
                  },
                ],
              },
            ];
          }
        });
        Swal.fire({
          title: "Success",
          text: "Trip added to date",
          icon: "success",
        });
      });
  };

  const handleAddTrips = (e) => {
    e.preventDefault();
    fetch("https://bus-counter-backend-production.up.railway.app/trips/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_name: e.target.trip.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTrips([...trips, { trip_name: e.target.trip.value }]);
        setTripsModalShow(false);
        Swal.fire({
          title: "Success",
          text: "Trip added",
          icon: "success",
        });
      });
  };

  const handleDeleteTrips = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "red",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        fetch(
          `https://bus-counter-backend-production.up.railway.app/trips/delete/date/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            const newTrips = dateTrip.filter((item) => item._id !== id);
            setDateTrip(newTrips);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          });
      }
    });
  };
  const handleDeleteTrip = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "red",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.value) {
        fetch(
          `https://bus-counter-backend-production.up.railway.app/trips/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            const newTrips = trips.filter((item) => item._id !== id);
            setTrips(newTrips);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          });
      }
    });
  };

  React.useEffect(() => {
    fetch("https://bus-counter-backend-production.up.railway.app/trips/all")
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
      })
      .catch((err) => console.log(err));
    fetch(
      "https://bus-counter-backend-production.up.railway.app/trips/all/date"
    )
      .then((res) => res.json())
      .then((data) => {
        setDateTrip(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div className="bg-blur shadow-lg rounded p-4">
        <h2 className="text-center mb-4">Manage Trips</h2>
        <p style={{ textAlign: "right" }}>
          <button
            className="btn btn-primary rounded-pill m-2"
            onClick={() => setTripsModalShow(true)}
          >
            Add New Trips
          </button>
          <button
            className="btn btn-primary rounded-pill m-2"
            onClick={() => setDateModalShow(true)}
          >
            Add Time Slot
          </button>
        </p>
        <div className="table-responsive">
          <table className="table table-hover-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Trips</th>
                <th scope="col" className="d-flex justify-content-end pe-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <li>{trip.trip_name}</li>
                  </td>
                  <td className="d-flex justify-content-end">
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="btn btn-danger rounded-pill mx-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-responsive">
          <table className="table table-hover-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Trips</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dateTrip.map((date, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{date.trip_date}</td>
                  <td>
                    <ul>
                      {date.trips.map((trip, index) => (
                        <li key={index}>
                          {trip.trip_name} - {trip.trip_time}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteTrips(date._id)}
                      className="btn btn-danger rounded-pill mx-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        show={tripsModalShow}
        onHide={() => setTripsModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add New Trips
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddTrips}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Trip Name</label>
              <input
                type="text"
                className="form-control"
                name="trip"
                required
                aria-describedby="emailHelp"
                placeholder="Enter Trip Name"
              />
            </div>
            <button className="btn btn-primary text-uppercase form-control mt-4">
              Add
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={dateModalShow}
        onHide={() => setDateModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Time Slot
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddTripsToDate}>
            <input
              placeholder="Date"
              name="date"
              type="date"
              className="form-control"
              required
            />
            <br />
            <input
              placeholder="Enter Time"
              name="time"
              type="time"
              className="form-control"
              required
            />
            {/* <br />
						<select name='trip' className='form-control' required>
							<option
								hidden
								className='text-primary'
								placeholder='trip'
								value='your favorite trip'>
								Your favorite trip
							</option>
							{trips?.map(trip => (
								<option key={trip._id} value={trip.trip_name}>
									{trip.trip_name}
								</option>
							))}
						</select> */}

            <button className="btn btn-primary text-uppercase form-control mt-4">
              Add
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageTrips;
