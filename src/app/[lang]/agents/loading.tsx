import { ListPageLoading } from "@/components/common/route-loading";

export default function AgentsLoading() {
  return <ListPageLoading count={8} columns="sm:grid-cols-2 lg:grid-cols-4" />;
}
