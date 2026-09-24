import { ListPageLoading } from "@/components/common/route-loading";

export default function BlogCategoryLoading() {
  return <ListPageLoading count={9} columns="sm:grid-cols-2 lg:grid-cols-3" />;
}
