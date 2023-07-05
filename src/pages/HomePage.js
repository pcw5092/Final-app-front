import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { jwtState } from "..";
import { REST_SERVER_ADDRESS } from "../common/constant";
import NavBar from '../component/NavBar';
import FeedBriefCard from "../component/feed/FeedBreifCard";

function HomePage() {
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [feeds, setFeeds] = useState([]);
    const formRef = useRef();

    // 최신 피드 얻어오기
    const updateFeed = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", REST_SERVER_ADDRESS + "/api/v1/feed/post", false);
        xhr.send();
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText);
            setCount(body.total);
            setFeeds([...feeds , ...body.feeds]);
            setPage(page+1);
        } else {
            // 데이터를 못 불러왔을 경우...
            window.alert("데이터를 불러오지 못했습니다.");
        }
    };


    useEffect(updateFeed, []);

    const submitHandle = (evt) => {
        evt.preventDefault();
        // 글 등록해주는 API 사용해주고

        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/feed/storage", false);
        xhr.setRequestHeader("Authorization", jwt);

        const body = new FormData();
        const description = formRef.current.description.value;
        body.append("description", description);

        const attaches = formRef.current.attaches.files;
        if (attaches.length != 0) {
            for (var file of attaches) {
                body.append("attaches", file);
            }
        }
        xhr.send(body);
        if (xhr.status === 201) {
            formRef.current.reset();
            updateFeed();
        } else {
            window.alert("새 글 등록 과정에 장애가 발생하였습니다.");
        }
        // 글 정상 등록되면

        updateFeed();
    };

    const errorImageHandle = (evt) => {
        // console.log(evt);
    };

    
    document.onscroll = (evt) => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200) {
            updateFeed();
        }
    };


    return (
        <>
            <NavBar />
            <div className="container mt-5 py-3">
                {jwt && (
                    <form ref={formRef} onSubmit={submitHandle} >
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="mb-3">
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        placeholder="What's happening?"
                                    ></textarea>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            name="attaches"
                                            accept="image/*"
                                            multiple
                                            className="form-control"
                                            id="inputGroupFile"
                                        />
                                        <label
                                            className="btn btn-sm btn-secondary"
                                            htmlFor="inputGroupFile"
                                        >
                                            <i className="bi bi-file-image"></i>
                                        </label>
                                    </div>
                                </div>
                                <button className="btn btn-primary">등록</button>
                            </div>
                        </div>
                    </form>
                )}
                {feeds &&
                    feeds.map((one) => (
                        <div className="card mb-3" id={one.id}>
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={one.writer.profileImage}
                                        className="rounded-circle me-2"
                                        style={{ width: 32, height: 32 }}
                                        onError={errorImageHandle}
                                    />
                                    <div>
                                        <h5 className="card-title m-0">{one.writer.name}</h5>
                                        <small className="text-muted">{one.writer.email}</small>
                                    </div>
                                </div>
                                <div className="mt-3">{one.description}</div>
                                <div className="d-flex align-items-center flex-wrap mt-3">
                                    {one.attaches.map((a) => (
                                        <div className="p-3">
                                            <img
                                                src={a.mediaUrl}
                                                className="img-fluid rounded"
                                                style={{ maxWidth: 200 }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                <FeedBriefCard />
            </div>
        </>
    );




}

export default HomePage;