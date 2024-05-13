import UserItem from "./user-item";
import classes from "./users-grid.module.css";

export default function UsersGrid({ users }) {
  return (
    <ul className={classes.meals}>
      {users.map((product) => (
        <li key={product.id}>
          <UserItem {...product} />
        </li>
      ))}
    </ul>
  );
}
