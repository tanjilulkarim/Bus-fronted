import React from "react";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useAuth } from "../../Contexts/AdminContext";
import { useData } from "../../Contexts/DataContext";
import Navbar from "../Navbar/Navbar";
import BookingInfo from "./BookingInfo";
import styles from "./style.module.css";

const Search = () => {
  const [trips, setTrips] = React.useState([]);
  const { searchTrips, setSearchTrips } = useData();
  const { user } = useAuth();
  const [search, setSearch] = React.useState(null);
  const [bookingId, setBookingId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [book, setBook] = React.useState(null);
  const [booking, setBooking] = React.useState(null);
  const [selectedSits, setSelectedSits] = React.useState([]);
  React.useEffect(() => {
    fetch("https://bus-counter-backend-production.up.railway.app/trips/all")
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
      })
      .catch((err) => console.log(err));

    if (searchTrips.date) {
      fetch(
        "https://bus-counter-backend-production.up.railway.app/trips/get/date",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trip_date: searchTrips.date,
            trip_name: searchTrips.trip,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setSearch(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchTrips]);
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
      setLoading(true);
      setSearch(null);
      setSearchTrips({
        trip: e.target.trip.value,
        date: e.target.date.value,
      });
    }
  };
  const handleBooking = (e) => {
    e.preventDefault();
    const bookingData = {
      trip_from: booking.from,
      trip_to: booking.to,
      trip_name: book.trip_name,
      passenger_name: booking.name,
      trip_date: searchTrips.date,
      trip_time: book.trip_time,
      trip_price: booking.charge,
      sit_selected: selectedSits,
      sits: book.sits,
      charge: booking.charge,
      commission: booking.commission,
      // chada: booking.chada,
      other_charges: booking.otherCharge,
      total: selectedSits.length * parseFloat(booking.charge),
      grand_total:
        selectedSits.length * booking.charge -
        (parseFloat(booking.otherCharge || 0) +
          parseFloat(booking.chada || 0) +
          parseFloat(booking.commission || 0)),
      trip_id: bookingId,
    };
    fetch(
      "https://bus-counter-backend-production.up.railway.app/booking/add/",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: "Booking Successful",
          text: "You have successfully booked a trip",
          icon: "success",
          confirmButtonText: "OK",
        });
        setShow(false);
        setBooking(null);
        setBook(null);
        setSearch(null);
        setSelectedSits([]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const handleChange = (e) => {
    if (!selectedSits.length) {
      Swal.fire({
        title: "Please Select a Seat",
        text: "Please select a seat to continue",
        icon: "warning",
        confirmButtonText: "Ok",
      });
    } else {
      setBooking((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  return (
    <div>
      <div className={`${styles.header} pb-5`}>
        <Navbar />
      </div>
      <div className={`${styles.search} row`}>
        <div className="col-md-3"></div>
        <div className="col-md-6 bg-white p-5 mt-5 shadow">
          <form onSubmit={handleSubmit} className="row">
            <div className="col-md-5 p-2">
              <select name="trip" className="form-control">
                <option
                  hidden
                  className="text-primary"
                  placeholder="trip"
                  value=""
                >
                  নবীন বরণ গাড়ির ট্রিপ
                </option>
                {trips?.map((trip) => (
                  <option key={trip._id} value={trip.trip_name}>
                    {trip.trip_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 p-2">
              <input type="date" name="date" className="form-control" />
            </div>

            <div className="col-md-3 p-2">
              <button className="btn btn-primary form-control">
                তারিখ নির্ধারণ করুন
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-3"></div>
      </div>
      <div className="container">
        {/* Loading Spinner */}
        {loading ? (
          <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : search && search?.length > 0 ? (
          <table className="table table-striped table-hover mt-5">
            <thead>
              <tr>
                <th scope="col">#id</th>
                <th scope="col">Time</th>
                <th scope="col">Trips Route</th>
                <th scope="col">Operator</th>
              </tr>
            </thead>
            <tbody>
              {search &&
                search?.map((trip, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1 < 10 ? `0${i + 1}` : i}</th>
                    <td>
                      <ul style={{ listStyle: "none" }}>
                        {trip.trips.map((item) => {
                          return <li key={item._id}>{item.trip_time}</li>;
                        })}
                      </ul>
                    </td>
                    <td>
                      <ul style={{ listStyle: "none" }}>
                        {trip.trips.map((item) => {
                          return <li key={item._id}>{item.trip_name}</li>;
                        })}
                      </ul>
                    </td>
                    <td>
                      {trip.trips.map((item) => {
                        return (
                          <span
                            onClick={() => {
                              setShow(true);
                              setBook(item);
                              setBookingId(trip._id);
                            }}
                            className="btn btn-primary"
                          >
                            View
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <h2 className="mt-5 text-center">No trips found</h2>
        )}
      </div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Booking a trip for {book && book.trip_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div
              className={`col-12 col-md-6 px-4 ${
                user?.type === "admin" && "mx-auto"
              }`}
            >
              <h5 className="mb-4">Bus Sit Plan - Select sit you want</h5>
              <div className="row row-cols-5 justify-content-evenly g-0">
                {book &&
                  Object?.keys(book.sits).map((item, i) => (
                    <h6
                      className={`text-center p-1 ${
                        [
                          2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50,
                        ].includes(i + 1)
                          ? "mr-5"
                          : ""
                      }`}
                      key={i}
                    >
                      <span
                        onClick={() => {
                          if (user?.type !== "admin") {
                            if (
                              book.sits[item] &&
                              !selectedSits.includes(item)
                            ) {
                              Swal.fire({
                                title: "Opps ... ",
                                text: "This sit is already booked, please select another sit",
                                icon: "warning",
                                confirmButtonText: "Ok",
                              });
                            } else {
                              const newBooks = { ...book };
                              newBooks.sits[item] = !newBooks.sits[item];
                              setBook({ ...newBooks });
                              if (selectedSits.includes(item)) {
                                setSelectedSits(
                                  selectedSits.filter((i) => i !== item)
                                );
                              } else {
                                setSelectedSits([...selectedSits, item]);
                              }
                            }
                          }
                        }}
                        className={`${book.sits[item] && "sit-active"} ${
                          selectedSits.includes(item) && "sit-selected"
                        } p-3 text-white sit-item pointer`}
                        style={{
                          width: "100%",
                          display: "block",
                        }}
                      >
                        {item}
                      </span>
                    </h6>
                  ))}
              </div>
              <div className="row mt-5 text-center">
                <div className="col-md-4">
                  <p className="sit-active p-2 px-3 text-white sit-item pointer">
                    Sit booked
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="sit-selected p-2 text-white sit-item pointer">
                    Sit selected
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="p-2 text-white sit-item pointer">
                    Sit available
                  </p>
                </div>
              </div>
            </div>

            {user && user.type !== "admin" ? (
              <div className="col-12 col-md-6">
                <form onSubmit={handleBooking}>
                  <div>
                    <label htmlFor="name" className="mb-1">
                      Name (নাম) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={booking?.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="যাত্রীর নাম"
                    />
                  </div>
                  <div className="my-2">
                    <label htmlFor="name" className="mb-1">
                      From (থেকে)
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={booking?.from}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="যাত্রা শুরু করার স্থান"
                    />
                  </div>
                  <div className="my-2">
                    <label htmlFor="name" className="mb-1">
                      To (পর্যন্ত)
                    </label>
                    <input
                      type="text"
                      name="to"
                      value={booking?.to}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="যাত্রা শেষ করার স্থান"
                    />
                  </div>

                  <div className="my-2">
                    <label htmlFor="name" className="mb-1">
                      Charge(ভাড়া)
                    </label>
                    <input
                      type="number"
                      name="charge"
                      value={booking?.charge}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="প্রতি সিট এর ভাড়া ?"
                    />
                  </div>
                  <div className="my-2">
                    <label htmlFor="name" className="mb-1">
                      Commission (কমিশন)
                    </label>
                    <input
                      type="number"
                      name="commission"
                      value={booking?.commission}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="কমিশন পরিমাণ ?"
                    />
                  </div>
                  {/* <div className='my-2'>
										<label htmlFor='name' className='mb-1'>
											Chada (চাঁদা)
										</label>
										<input
											type='number'
											name='chada'
											value={booking?.chada}
											onChange={handleChange}
											className='form-control'
											placeholder='চাঁদা পরিমাণ ?'
										/>
									</div> */}
                  <div className="my-2">
                    <label htmlFor="name" className="mb-1">
                      Other Charge
                    </label>
                    <input
                      type="number"
                      name="otherCharge"
                      value={booking?.otherCharge}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="অন্যান্য খরচ ?"
                    />
                  </div>
                  <div className="my-2">
                    <p className="mb-1">Selected Sits</p>
                    {selectedSits.length > 0 &&
                      selectedSits.map((item, index) => (
                        <span key={index} className="">
                          {item},{" "}
                        </span>
                      ))}
                  </div>

                  <div className="mt-4 border border-2 p-2">
                    <p className="mb-1">
                      Total Amount({selectedSits.length} * {booking?.charge}) :
                      &#2547;{" "}
                      {(booking && selectedSits.length * booking.charge) || 0}
                    </p>
                    <p className="mb-1">
                      Grand Total({selectedSits.length * booking?.charge || 0} -{" "}
                      {parseFloat(booking?.commission) || 0} -{" "}
                      {parseFloat(booking?.otherCharge) || 0}) : &#2547;{" "}
                      {(booking &&
                        selectedSits.length * booking.charge -
                          (parseFloat(booking.commission || 0) +
                            parseFloat(booking.otherCharge || 0))) ||
                        0}
                    </p>
                  </div>
                  <div className="my-2">
                    <button
                      type="submit"
                      className="btn btn-success btn-gradient form-control"
                    >
                      Book Now
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}

            <BookingInfo book={book} date={searchTrips.date} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)} className="btn-danger">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Search;
