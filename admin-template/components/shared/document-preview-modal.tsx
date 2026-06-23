"use client"

import { useState, useEffect } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, Eye, ExternalLink, RotateCcw, RotateCw } from "lucide-react"
import { cn, isPreviewable, isImage, isPdf } from "@/lib/utils"

interface DocumentPreviewModalProps {
	url: string | null
	title?: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function DocumentPreviewModal({
	url,
	title = "Document Preview",
	open,
	onOpenChange,
}: DocumentPreviewModalProps) {
	const canPreview = url ? isPreviewable(url) : false
	const isImg = url ? isImage(url) : false
	const isPdfFile = url ? isPdf(url) : false

	const [rotationDeg, setRotationDeg] = useState(0)

	useEffect(() => {
		setRotationDeg(0)
	}, [url, open])

	const rotateLeft = () => setRotationDeg((d) => (d - 90 + 360) % 360)
	const rotateRight = () => setRotationDeg((d) => (d + 90) % 360)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<div className="flex-1 min-h-0 overflow-auto">
					{!url ? (
						<div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
							<FileText className="size-12 text-muted-foreground/50" />
							<p className="text-sm">No document available</p>
						</div>
					) : canPreview ? (
						<div className="flex items-center justify-center w-full min-h-[200px]">
							{isImg && (
								<img
									src={url}
									alt={title}
									className={cn(
										"max-w-full max-h-[60vh] object-contain rounded-md transition-transform duration-200 ease-out",
									)}
									style={{ transform: `rotate(${rotationDeg}deg)` }}
								/>
							)}
							{isPdfFile && (
								<div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
									<FileText className="size-12 text-muted-foreground/50" />
									<p className="text-sm">PDF preview is not available</p>
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
							<FileText className="size-12 text-muted-foreground/50" />
							<p className="text-sm">
								This file type cannot be previewed
							</p>
						</div>
					)}
				</div>

				<DialogFooter>
					{url && (
						<div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
							{isImg && (
								<div className="flex items-center gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										icon={RotateCcw}
										iconPosition="start"
										onClick={rotateLeft}
										title="Rotate 90° counterclockwise"
									>
										Rotate left
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										icon={RotateCw}
										iconPosition="start"
										onClick={rotateRight}
										title="Rotate 90° clockwise"
									>
										Rotate right
									</Button>
								</div>
							)}
							<div
								className={cn(
									"flex flex-wrap items-center gap-2",
									!isImg && "sm:ml-auto",
								)}
							>
								<a href={url} target="_blank" rel="noopener noreferrer">
									<Button variant="outline" icon={ExternalLink} iconPosition="start">
										Open in New Tab
									</Button>
								</a>
								<a href={url} download>
									<Button variant="default" icon={Download} iconPosition="start">
										Download
									</Button>
								</a>
							</div>
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

interface DocumentPreviewTriggerProps {
	url: string | null
	title?: string
	children?: React.ReactNode
}

export function DocumentPreviewTrigger({
	url,
	title = "Document Preview",
	children,
}: DocumentPreviewTriggerProps) {
	const [open, setOpen] = useState(false)

	const handleClick = () => {
		if (!url) return
		setOpen(true)
	}

	return (
		<>
			{children ? (
				<span onClick={handleClick} className="cursor-pointer">
					{children}
				</span>
			) : (
				<button
					onClick={handleClick}
					disabled={!url}
					className="flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Eye className="size-4" />
					{url ? "View Document" : "No document available"}
				</button>
			)}
			<DocumentPreviewModal
				url={url}
				title={title}
				open={open}
				onOpenChange={setOpen}
			/>
		</>
	)
}
