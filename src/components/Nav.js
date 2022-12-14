import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "../assets/scss/components/nav.scss";

// design library (mantine, reactstrap)
import { Collapse } from "reactstrap";
import { Modal, Avatar, Menu } from "@mantine/core";

// recoil
import {
	jwtTokenState,
	loginModalState,
	userIdState,
	userInfoState,
	searchModalState,
} from "../utils/atom";
import { useRecoilState } from "recoil";

// components
import Search from "../components/Search";
import OauthLogin from "./login/OauthLogin";
import { PlatformLinkOptions } from "./PlatformLinkOptions";
import { ReactComponent as Logo } from "../assets/img/logo.svg";

// icon
import {
	faCaretDown,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
	IconBook2,
	IconChevronRight,
	IconEdit,
	IconLayoutDashboard,
	IconLogout,
	IconMessageCircle,
} from "@tabler/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showNotification } from "@mantine/notifications";

export const LogoComponent = () => {
	return (
		<div className="logo">
			<Link to="/" onClick={() => (window.location.href = "/")}>
				<Logo />
			</Link>
		</div>
	);
};

const TransformPage = (props) => {
	const { url, text, icon } = props;
	return (
		<Link to={url} state={"/board"} className="page-select">
			<span>
				{icon} {text}
			</span>
			<span className="arrow">
				<IconChevronRight />
			</span>
		</Link>
	);
};

const PlatformLink = (props) => {
	const { pathname } = useLocation();
	const { option, active } = props;
	const { icon, name, src, boardSrc } = option;

	return (
		<li onClick={() => props.getData(name)}>
			{pathname.split("/")[1] === "board" ? (
				<Link
					to="/board"
					state={boardSrc}
					className={active === name ? "active" : ""}
				>
					<span>{icon}</span>
					<span className="platform-name">{name}</span>
				</Link>
			) : (
				<Link to={src} className={active === name ? "active" : ""}>
					<span>{icon}</span>
					<span className="platform-name">{name}</span>
				</Link>
			)}
		</li>
	);
};

const PlatformSelect = () => {
	const [platformNameSelected, setPlatformNameSelected] = useState("??????");
	const { pathname } = useLocation();

	useEffect(() => {
		switch (pathname.split("/")[1]) {
			case "naver":
				setPlatformNameSelected("?????????");
				break;
			case "kakao":
				setPlatformNameSelected("?????????");
				break;
			case "kakaoPage":
				setPlatformNameSelected("?????????");
				break;
			default:
				setPlatformNameSelected("??????");
				break;
		}
	}, [pathname]);

	const getPlatformName = (name) => {
		setPlatformNameSelected(name);
	};

	return (
		<div className="platform-container">
			<ul className="platform-list">
				{PlatformLinkOptions.map((item) => {
					return (
						<PlatformLink
							active={platformNameSelected}
							option={item}
							getData={getPlatformName}
						/>
					);
				})}
			</ul>
		</div>
	);
};

const WebtoonSearch = () => {
	// ?????? Modal
	const [modalOpen, setModalOpen] = useRecoilState(searchModalState);
	const modalHandler = () => setModalOpen(!modalOpen);

	return (
		<>
			<span className="search" onClick={modalHandler}>
				?????? &nbsp;
				<FontAwesomeIcon icon={faMagnifyingGlass} />
			</span>
			<Search isOpen={modalOpen} toggle={modalHandler} />
		</>
	);
};

export const SignIn = () => {
	const { pathname } = useLocation();
	const [modalOpen, setModalOpen] = useRecoilState(loginModalState);
	const modalHandler = () => setModalOpen(!modalOpen);
	return (
		<>
			<div className="login-container">
				{pathname === "/webtoon" || pathname === "/board/detail" ? (
					""
				) : (
					<WebtoonSearch />
				)}
				<span className="login-btn" onClick={modalHandler}>
					?????????
				</span>
			</div>
			<Modal
				size="sm"
				centered
				opened={modalOpen}
				onClose={modalHandler}
				title="?????????"
				className="login-modal-container"
			>
				<OauthLogin />
			</Modal>
		</>
	);
};

export const UserInfo = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [userInfo, setUserInfo] = useRecoilState(userInfoState);

	const logout = () => {
		localStorage.removeItem("Authentication");
		localStorage.removeItem("userId");
		navigate("/");
		showNotification({
			message: "??????????????? ???????????????????????????.",
			autoClose: 2000,
			radius: "md",
			color: "green",
		});
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	};

	const navigateHandler = (url) => {
		navigate(url, { state: userInfo });
	};

	return (
		<div className="login-container">
			{pathname === "/webtoon" ||
			pathname === "/mywebtoon" ||
			pathname === "/board/detail" ||
			pathname === "/userinfo" ? (
				""
			) : (
				<WebtoonSearch />
			)}
			<span className="user-avatar">
				<Menu shadow="lg" width={220} position="bottom-end">
					<Menu.Target>
						<Avatar src={userInfo?.profileImage} radius="xl" />
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item onClick={() => navigateHandler("/userinfo")}>
							<div className="user-info-container">
								<Avatar src={userInfo?.profileImage} radius="md" />
								<div className="user-info">
									<h5>{userInfo?.nickname}</h5>
									<p>
										<span>{userInfo?.age?.split("~")[0]}???</span>/
										<span>{userInfo?.gender === "male" ? "??????" : "??????"}</span>
									</p>
								</div>
							</div>
						</Menu.Item>
						<Menu.Item
							icon={<IconBook2 size={16} />}
							onClick={() => navigateHandler("/mywebtoon")}
						>
							<div>?????? ??????</div>
						</Menu.Item>
						<Menu.Item
							icon={<IconEdit size={16} />}
							onClick={() => navigateHandler("/userinfo")}
						>
							<div>????????? ??????</div>
						</Menu.Item>
						<Menu.Item
							className="logout"
							icon={<IconLogout size={16} />}
							onClick={logout}
						>
							????????????
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</span>
		</div>
	);
};

const WeekLink = () => {
	const { search } = useLocation();
	const week = ["???", "???", "???", "???", "???", "???", "???"];
	const todayNum = new Date().getDay();

	const weekDayLinkOptions = week.map((day, weekNum) => ({
		name: day,
		src: `?week=${weekNum}`,
	}));

	weekDayLinkOptions.unshift({
		name: "??????",
		src: "?week=new",
	});

	weekDayLinkOptions.push({
		name: "??????",
		src: "?week=fin",
	});

	const today = week[todayNum === 0 ? 6 : todayNum - 1];

	// ?????? nav
	const WeekList = weekDayLinkOptions.map((weekItem, index) => {
		let active = "";
		!search
			? weekItem.name === today && (active = "active")
			: weekItem.src.includes(search) && (active = "active");

		return (
			<li key={index}>
				<Link to={weekItem.src} className={active}>
					{weekItem.name}
				</Link>
			</li>
		);
	});

	return <ul className="week-list-wrap">{WeekList}</ul>;
};

const Nav = () => {
	const { pathname } = useLocation();
	const [userInfo, setUserInfo] = useRecoilState(userInfoState);
	const [jwtToken, setJwtToken] = useRecoilState(jwtTokenState);

	useEffect(() => {
		setJwtToken(localStorage.getItem("Authentication"));

		axios
			.get(API_URL + `/auth/userinfo/${localStorage.getItem("userId")}`)
			.then((response) => {
				setUserInfo(response.data);
			});
	}, [pathname]);

	return (
		<section className="nav-section">
			<div className="nav-container">
				<LogoComponent />
				<TransformPage
					url={pathname.includes("board") ? "/all" : "/board"}
					text={
						pathname.includes("board") ? "???????????? ?????? ??????" : "?????? ?????? ??????"
					}
					icon={
						pathname.includes("board") ? (
							<IconLayoutDashboard />
						) : (
							<IconMessageCircle />
						)
					}
				/>
				{jwtToken !== null ? <UserInfo /> : <SignIn />}
			</div>
			<div className="mobile-page-select">
				<TransformPage
					url={pathname.includes("board") ? "/all" : "/board"}
					text={
						pathname.includes("board") ? "???????????? ?????? ??????" : "?????? ?????? ??????"
					}
					icon={
						pathname.includes("board") ? (
							<IconLayoutDashboard />
						) : (
							<IconMessageCircle />
						)
					}
				/>
			</div>
			<PlatformSelect />
			{pathname.includes("board") ? (
				""
			) : (
				<>
					<WeekLink />
				</>
			)}
		</section>
	);
};

export default Nav;
