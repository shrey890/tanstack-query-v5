import { Form, Formik, Field, FieldProps } from "formik";

import { useState } from "react";

import { BlogType } from "@/types";
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogTrigger,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog, updateBlog } from "@/api";
import { useToast } from "@/components/ui/use-toast";
export interface BlogHandlerProps {
	blog?: BlogType;
	isUpdate?: boolean;
}

export function BlogHandler(props: BlogHandlerProps) {
	const [open, setOpen] = useState(false);
	const { blog, isUpdate = false } = props;
	const { toast } = useToast();
	const cache = useQueryClient();
	const createBlogMutation = useMutation({
		mutationKey: ["CREATE_BLOG"],
		mutationFn: createBlog,
		onSuccess: () => {
			setOpen(false);
			toast({
				title: "created successfully",
				description: "Blog created successfully",
				variant: "success",
			});
			cache.invalidateQueries({
				queryKey: ["BLOGS"],
			});
		},
		onError: (err) => {
			toast({
				title: "Error creating ",
				description: err.message,
				variant: "destructive",
			});
			setOpen(false);
		},
	});
	const updateBlogMutation = useMutation({
		mutationKey: ["UPDATE_BLOG"],
		mutationFn: updateBlog,
		onSuccess: () => {
			setOpen(false);
			toast({
				title: "updated successfully",
				description: "Blog updated successfully",
				variant: "success",
			});
			cache.invalidateQueries({
				queryKey: ["BLOGS"],
			});
		},
		onError: (err) => {
			toast({
				title: "Error updating blog",
				description: err.message,
				variant: "destructive",
			});
			setOpen(false);
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" onClick={() => setOpen(true)}>
					{isUpdate ? "Update" : "Add"} Blog
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isUpdate ? "Update" : "Add"} Blog</DialogTitle>
					<DialogDescription>
						Enter your blog title and content
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Formik
						initialValues={
							isUpdate
								? { title: blog?.title, content: blog?.content }
								: { title: "", content: "" }
						}
						onSubmit={async (values) => {
							if (isUpdate) {
								updateBlogMutation.mutate({
									id: blog?._id as string,
									title: values.title!,
									content: values.content!,
								});
							} else {
								createBlogMutation.mutateAsync({
									title: values.title!,
									content: values.content!,
								});
							}
						}}
					>
						<Form className="flex flex-col gap-4 justify-end">
							<label htmlFor="title">Title</label>
							<Field name="title">
								{({ field, meta }: FieldProps) => (
									<div>
										<Input type="text" {...field} />
										{meta.touched && meta.error && (
											<div className="error">{meta.error}</div>
										)}
									</div>
								)}
							</Field>

							<label htmlFor="content">Content</label>
							<Field name="content">
								{({ field, meta }: FieldProps) => (
									<div>
										<Input type="text" {...field} />
										{meta.touched && meta.error && (
											<div className="error">{meta.error}</div>
										)}
									</div>
								)}
							</Field>
							<div className="flex justify-end">
								<Button className="mt-4" type="submit">
									Submit
								</Button>
							</div>
						</Form>
					</Formik>
				</div>
			</DialogContent>
		</Dialog>
	);
}
