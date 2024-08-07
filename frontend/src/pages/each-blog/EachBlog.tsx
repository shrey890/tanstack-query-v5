import { getBlog } from "@/api";
import { Button } from "@/components/ui/button";
import { BlogType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

export interface EachBlogProps {}

export function EachBlog(props: EachBlogProps) {
	const {} = props;
	const { id } = useParams();
	const {
		data: blog,
		isLoading,
		isError,
		error,
	} = useQuery<BlogType[]>({
		queryKey: ["BLOGS", id],
		queryFn: () => getBlog({ id: id as string }),
		retry: false,
	});
	if (isLoading)
		return (
			<div className="flex justify-center w-full  flex-col items-center  gap-7 mt-8">
				Loading...
			</div>
		);
	if (isError)
		return (
			<div className="flex justify-center w-full  flex-col items-center  gap-7 mt-8">
				{error.message}
			</div>
		);
	return (
		<div className="max-w-md mx-auto py-5">
			<div className="py-4">
				<Link to="/">
					<Button>Home</Button>
				</Link>
			</div>
			<div
				key={blog?._id}
				className="w-full rounded  shadow-sm shadow-stone-400 p-4  items-center  "
			>
				<h1 className="font-bold text-lg">{blog?.title}</h1>
				<p className="text-md">{blog?.content}</p>
			</div>
		</div>
	);
}
