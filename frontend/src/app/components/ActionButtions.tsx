import { ActionButtonsProps } from "../types"

export default function ActionButtons ({onDownload, onReset, isDownloading}: ActionButtonsProps) {
	return(
		<div className="bg-[#5d1283] rounded-lg p-3 border-2 border-black/30">
			<div className="flex flex-col space-y-2">
				<button className="px-3 py-2 text-white border-2 border-white rounded-lg hover:bg-white hover:text-[#5d1283] transition-colors duration-300 cursor-pointer"
					onClick={onDownload}
					disabled={isDownloading}
					>
					<div className="min-w-[180px] flex justify-center items-center"></div>
					{isDownloading ? (
						<>
						Downloading<span className="inline-block w-[1.5ch] ml-1 animate-dots text-white">.</span>
						</>
					) : (
						"Download & Share"
					)}
				</button>
				<button
					className="px-3 py-2 text-white border-2 border-white rounded-lg hover:bg-white hover:text-[#5d1283] transition-colors duration-300 cursor-pointer"
					onClick={onReset}
				>
					Try Another Video
				</button>
			</div>
		</div>
	)
};