import React, { useState, useEffect, useMemo } from "react";
import router from "next/router";
// firebase
import { db } from "src/firebase";
import { ref, orderByChild, query, onValue } from "firebase/database";
// redux
import { useDispatch } from "react-redux";
import { useUserPackageHook } from "public/redux/hooks";
import { userCurrentEventHosting } from "public/redux/actions";
// components
import { Header, Input, Line, Button } from "public/shared";
import EventButton from "public/shared/button/EventButton";
import { LEFT_COLOR, RIGHT_COLOR } from "public/util/colors";
//gif
import nyancat from "public/img/nyancat.gif";

export default function Dashboard() {
  const [arrStatus, setArrStatus] = useState([]);
  const [arrID, setArrID] = useState([]);
  const dispatch = useDispatch();
  const currentUser = useUserPackageHook();
  // create query
  const queDb = query(ref(db, "event"), orderByChild("createAt"));
  // authentication, only users can access this page
  const checkAuth = () => {
    router.push("/auth/login");
  };
  // get(child(ref(db), `event`))
  // .then((snapshot) => {
  //   const res = snapshot.val() ?? [];
  //   const values = Object.values(res);
  //   setArr(values);
  // })
  // .catch((error) => {
  //   alert(error.message);
  //   console.error(error);
  // });
  // useEffect(() => {
  //   onValue(child(ref(db), "event/"), (snapshot) => {
  //     const record = snapshot.val() ?? [];
  //     const values = Object.values(record);
  //     values.forEach((value) => {
  //       if (value.status === 2) {
  //         setQueryStatus((prev) => [...prev, value]);
  //         console.log(value);
  //       }
  //     });
  //     console.log(queryStatus);
  //   });
  // }, []);
  useEffect(() => {
    onValue(queDb, (snapshot) => {
      setArrStatus([]);
      const data = snapshot.val();
      if (data != null) {
        const values = Object.values(data);
        values.forEach((value) => {
          if (
            value.delFlag === false &&
            (value.status === 1 || value.status === 2 || value.status === 3) &&
            value.createBy === currentUser.userId
          )
            setArrStatus((prev) => [...prev, value]);
        });
      }
    });
  }, []);
  useEffect(() => {
    onValue(queDb, (snapshot) => {
      setArrID([]);
      const data = snapshot.val();
      if (data != null) {
        const values = Object.values(data);
        values.forEach((value) => {
          if (value.delFlag === false && value.createBy === currentUser.userId)
            setArrID((prev) => [...prev, value]);
        });
      }
    });
  }, [String(currentUser.userId)]);

  //render view
  const renderHeader = useMemo(() => {
    return <Header />;
  }, []);
  const renderWelcome = useMemo(() => {
    return (
      <div className="flex flex-col pb-4 pt-2">
        <div className="flex flex-col">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col flex-1">
              <p className="font-bold text-sm text-[#656565] mt-2">
                {"Ch??o m???ng ?????n v???i AIT Lucky App,"}
              </p>
              <p className="text-sm text-[#656565] mb-2">
                {"H??y b???t ?????u tham gia c??c s??? ki???n ngay n??o!"}
              </p>
            </div>
            <img
              src={nyancat}
              className="w-1/5 min-h-min "
              alt="must be a nyancat gif"
            ></img>
          </div>
        </div>
        <div className="w-full mb-2">
          <Line marginY={false} />
        </div>
      </div>
    );
  }, []);
  const renderJoinEvent = useMemo(() => {
    return (
      <Input content={"Tham gia s??? ki???n"}>
        <div className="flex flex-col pb-4 pt-2">
          <p className=" f text-sm text-[#656565] my-2">
            {"Tham gia v??o c??c s??? ki???n ???????c t??? ch???c b???ng m?? pin."}
          </p>
          <a href="/">
            <Button
              margin={"my-0"}
              content={"CH??I V???I M?? PIN!"}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </a>
        </div>
      </Input>
    );
  }, []);
  const renderShowCurrentEvent = useMemo(() => {
    return (
      <Input content={"C??c s??? ki???n ??ang di???n ra"} isTextGradient={true}>
        <div className="flex flex-col py-4">
          <p className=" text-sm text-[#656565] mb-2">
            {"Hi???n th??? c??c s??? ki???n ??ang di???n ra c???a t??i"}
          </p>
          <div className="w-full flex flex-col gap-y-[7px] overflow-auto max-h-[188px] scrollbar-hide">
            {arrStatus.length === 0 ? (
              <div className="w-full flex items-center text-center justify-center text-sm text-[#000000]">
                {" "}
                {"Kh??ng c?? d??? li???u"}
              </div>
            ) : (
              arrStatus.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <EventButton
                    title={item.title}
                    id={item.eventId}
                    userJoined={item.userJoined}
                    status={item.status}
                    db={1}
                    onclick={() => dispatch(userCurrentEventHosting(item))}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </Input>
    );
  }, [arrStatus]);
  const renderCreateEvent = useMemo(() => {
    return (
      <Input content={"T???o s??? ki???n"} isTextGradient={true}>
        <div className="">
          <p className="text-sm text-[#656565] pt-4">
            {
              "T???o m???t s??? ki???n quay th?????ng m???i, b???n c?? th??? thi???t l???p c??c gi???i th?????ng, m???i gi???i th?????ng g???m t??n, kh??i qu??t, h??nh ???nh gi???i th?????ng, s??? l?????ng gi???i."
            }
          </p>
          <a href="/admin/event/event-register">
            <Button
              content={"T???O S??? KI???N NGAY"}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </a>
        </div>
      </Input>
    );
  }, []);

  const renderShowCreateEvent = useMemo(() => {
    return (
      <Input content={"Danh s??ch s??? ki???n"} isTextGradient={true}>
        <p className=" text-sm text-[#656565] mt-4 mb-2">
          {"Hi???n th??? c??c s??? ki???n g???n ????y c???a t??i ???? t???o"}
        </p>
        <div className="flex flex-col gap-y-[7px]">
          {arrID.length === 0 ? (
            <div className="w-full flex items-center text-center justify-center text-sm text-[#000000] ">
              {" "}
              {"Kh??ng c?? d??? li???u"}
            </div>
          ) : (
            arrID.slice(0, 4).map((item, index) => (
              <div key={index} className="flex flex-col">
                <EventButton
                  title={item.title}
                  id={item.eventId}
                  status={item.status}
                  userJoined={item.userJoined}
                  db={2}
                  onclick={() => dispatch(userCurrentEventHosting(item))}
                />
              </div>
            ))
          )}
          <a href="event-list">
            <Button
              content={"T???t c??? s??? ki???n"}
              primaryColor={LEFT_COLOR}
              secondaryColor={RIGHT_COLOR}
            />
          </a>
        </div>
      </Input>
    );
  }, [arrID]);

  return (
    <>
      {currentUser.userId == null ? (
        checkAuth()
      ) : (
        <div>
          {renderHeader}
          <section className="h-full max-w-xl w-4/5 mx-auto flex flex-col justify-center items-center pt-2">
            {/* {welcome to AIT App} */}
            {renderWelcome}
            {/* participate in event */}
            {renderJoinEvent}
            {/* show my curent event */}
            {renderShowCurrentEvent}
            {/* create new event  */}
            {renderCreateEvent}
            {/* show all my event */}
            {renderShowCreateEvent}
          </section>
        </div>
      )}
    </>
  );
}
