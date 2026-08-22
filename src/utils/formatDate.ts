export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();

  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }

  const targetDate = new Date(date);
  const timeDifference = currentDate.getTime() - targetDate.getTime();
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutesAgo = Math.floor(timeDifference / (1000 * 60));
  const secondsAgo = Math.floor(timeDifference / 1000);

  let formattedDate = "";

  if (daysAgo >= 365) {
    formattedDate = `${Math.floor(daysAgo / 365)} 年前`;
  } else if (daysAgo >= 30) {
    formattedDate = `${Math.floor(daysAgo / 30)} 个月前`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo} 天前`;
  } else if (hoursAgo > 0) {
    formattedDate = `${hoursAgo} 小时前`;
  } else if (minutesAgo > 0) {
    formattedDate = `${minutesAgo} 分钟前`;
  } else {
    formattedDate = "刚刚";
  }

  const fullDate = targetDate.toLocaleString("zh-CN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate}（${formattedDate}）`;
}
