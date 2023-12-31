import { trpc } from "../utils/trpc";

const Test = () => {
  const data = trpc.todos.useQuery();
  console.log(data.data);

  return (
    <ul>
      {data.data?.map((todo: any) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
};

export default Test;
