"use client";

import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import notes from "@/notes.json";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const DEFAULT_INTERVAL = 10;
const FILTERS = ["E", "A", "D", "G", "ALL"];

const HomePage = () => {
	const [stringData, setStringData] = useState(notes.notes);

	const [currentNote, setCurrentNote] = useState({
		note: "",
		string: "",
	});
	const [intervalTime, setIntervalTime] = useState(DEFAULT_INTERVAL * 1000);
	const [isStart, setIsStart] = useState(false);
	const animationRef = useRef<any>(null);
	const [selectedFilter, setSelectedFilter] = useState("ALL");

	const onIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setIntervalTime(value * 1000);
	};

	const onStartPressed = () => {
		if (animationRef.current && !isStart) {
			animationRef.current.play();
		} else if (animationRef.current && isStart) {
			animationRef.current.pause();
			animationRef.current.kill();
		}

		setIsStart((isStart) => !isStart);
	};

	useEffect(() => {
		const data = notes.notes.filter((value) => {
			if (selectedFilter === "ALL") {
				return true;
			} else {
				return value.string === selectedFilter;
			}
		});

		setStringData(data);
	}, [selectedFilter]);

	useEffect(() => {
		if (!isStart) return;

		const getRandomNote = () => {
			const { length } = stringData;
			return stringData[Math.floor(Math.random() * length)];
		};

		setCurrentNote(getRandomNote());

		const timer = setInterval(() => {
			setCurrentNote(getRandomNote());
		}, intervalTime);

		return () => clearInterval(timer);
	}, [intervalTime, isStart, stringData]);

	useGSAP(() => {
		if (currentNote.note == "") return;

		if (animationRef.current) {
			animationRef.current.kill();
		}

		const animation = gsap.fromTo(
			".progress",
			{ scaleX: 0, transformOrigin: "left" },
			{ scaleX: 1, duration: intervalTime / 1000, ease: "linear" }
		);

		animationRef.current = animation;

		return () => {
			animationRef.current.kill();
		};
	}, [currentNote]);

	return (
		<div className="flex flex-col items-center justify-center min-w-screen min-h-[100vh] ">
			<div className="flex flex-col">
				<div className="flex items-center gap-[10px]">
					<div className="flex flex-col items-center">
						<div className="w-full flex mb-2 justify-between">
							{FILTERS.map((filter) => (
								<div
									className={`w-[20%] h-[40px] flex items-center justify-center ${
										selectedFilter == filter ? "bg-[#4a4a4a] text-white" : "bg-[#eeeeee]"
									} cursor-pointer`}
									onClick={() => {
										setSelectedFilter(filter);
									}}
								>
									{filter}
								</div>
							))}
						</div>
						<p className="h-[300px] w-[300px] flex items-center justify-center text-[120px] bg-[#dbdbdb]">
							{currentNote.note}
						</p>
						<div className="w-full">
							<div className="progress h-[5px] bg-black"></div>
						</div>
						<button className="py-1 px-6 mt-2 bg-black text-white rounded-full" onClick={onStartPressed}>
							{!isStart ? "Start" : "Stop"}
						</button>
					</div>
					<div className="flex flex-col">
						<p>
							<b>{currentNote.string} String</b>
						</p>
						<p>
							<span>Inverval: </span>
							<input type="number" min="1" max="10" defaultValue={DEFAULT_INTERVAL} onChange={onIntervalChange}></input>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
