export default function Page({ params }: { params: { id: string } }) {
  return <div>Job Id: {params.id}</div>
}