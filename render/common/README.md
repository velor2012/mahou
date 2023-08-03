# @mahou/render-common

使用说明见如下。

### 真寻日报

构建 `dist/index.html` ：

```bash
  pnpm i
  pnpm build
```

在 [`mahiro`](../../mahiro) 包内运行命令，生成 bangumi 临时缓存数据：

```bash
  pnpm sync:bgm
```

导入 `mahir/index.ts` 中的插件即可使用：

```ts
import { Mahou } from 'path/to/mahiro'

// ...

mahiro.use(Mahou())
```
