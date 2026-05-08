import { run } from "./solver";
import srt1 from "./srt-1";
import srt2 from "./srt-2";
import srq1 from "./srq-1";
import srq2 from "./srq-2";
import sratHenz from "./srat-henz";
import srat from "./srat";

for (const p of [srt1, srt2, srq1, srq2, sratHenz, srat]) run(p);
