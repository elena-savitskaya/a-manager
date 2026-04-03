import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"outline"} className="font-normal">
        Потрібно налаштувати змінні середовища Supabase
      </Badge>
      <div className="flex gap-2">
        <Button variant={"outline"} className="h-12 rounded-xl" disabled>
          Увійти
        </Button>
        <Button variant={"default"} className="h-12 rounded-xl" disabled>
          Зареєструватися
        </Button>
      </div>
    </div>
  );
}
