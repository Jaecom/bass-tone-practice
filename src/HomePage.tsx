"use client";

import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import notes from "@/notes.json";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const DEFAULT_INTERVAL = 4;
const FILTERS = ["E", "A", "D", "G", "ALL"];

const HomePage = () => {
	const [data, setData] = useState(notes.notes);

	const [currentNoteData, setCurrentNoteData] = useState({
		note: "",
		string: "",
	});
	const [intervalTime, setIntervalTime] = useState(DEFAULT_INTERVAL * 1000);
	const [isPlaying, setIsPlaying] = useState(false);
	const animationRef = useRef<gsap.core.Tween | null>(null);
	const [selectedFilter, setSelectedFilter] = useState("ALL");

	const onIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setIntervalTime(value * 1000);
	};

	const onStartPressed = () => {
		if (animationRef.current && !isPlaying) {
			animationRef.current.play();
		} else if (animationRef.current && isPlaying) {
			animationRef.current.pause();
			animationRef.current.kill();
		}

		setIsPlaying((isPlaying) => !isPlaying);
	};

	useEffect(() => {
		const data = notes.notes.filter((value) => {
			if (selectedFilter === "ALL") {
				return true;
			} else {
				return value.string === selectedFilter;
			}
		});

		setData(data);
	}, [selectedFilter]);

	useEffect(() => {
		if (!isPlaying) return;

		const setNewNote = () => {
			setCurrentNoteData((currentNoteData) => {
				const filteredData = data.filter((note) => note.note !== currentNoteData.note);
				const newNote = filteredData[Math.floor(Math.random() * filteredData.length)];

				if (!newNote) return { note: "", string: "" };

				return newNote;
			});
		};

		setNewNote();

		const timer = setInterval(() => {
			setNewNote();
		}, intervalTime);

		return () => clearInterval(timer);
	}, [intervalTime, isPlaying, data]);

	useGSAP(() => {
		if (currentNoteData.note == "") return;

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
			if (animationRef.current) {
				animationRef.current.kill();
			}
		};
	}, [currentNoteData]);

	return (
		<div className="flex flex-col items-center justify-center min-w-screen min-h-[100vh] ">
			<div className="flex flex-col">
				<div className="flex items-center gap-[10px]">
					<div className="flex flex-col items-center">
						<div className="w-full flex mb-2 justify-between">
							{FILTERS.map((filter) => (
								<div
									key={filter}
									className={`w-[20%] h-[40px] flex items-center justify-center ${
										selectedFilter == filter ? "bg-[#707070] text-white" : "bg-[#eeeeee]"
									} cursor-pointer`}
									onClick={() => {
										setSelectedFilter(filter);
									}}
								>
									{filter}
								</div>
							))}
						</div>
						<div className="h-[300px] flex items-center justify-center w-[300px] bg-[#dbdbdb]">
							<div className="flex flex-col text-center">
								{selectedFilter === "ALL" && currentNoteData.note !== "" && (
									<p className="mb-[-30px]">
										<b>{currentNoteData.string} String</b>
									</p>
								)}
								<p className="text-[120px]">{currentNoteData.note}</p>
							</div>
						</div>

						<div className="w-full">
							<div className="progress h-[5px] bg-black"></div>
						</div>

						<div className="flex items-center mt-6 gap-x-[12px]">
							<button className={`py-1 px-6 rounded-full text-white bg-black`} onClick={onStartPressed}>
								{!isPlaying ? "Start" : "Stop"}
							</button>
							<p className="rounded-full border-black border-solid border-[1px] py-1 pl-7 pr-2">
								<span>Interval: </span>
								<input type="number" min="1" max="10" defaultValue={DEFAULT_INTERVAL} onChange={onIntervalChange} />
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
