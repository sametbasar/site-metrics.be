export function getFileNameWithDateAndName(name:string, type:string) {
  const currentDate = new Date();
  const dateFormatted = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
  const fileName = `${name.toLowerCase().replaceAll(' ', '-')}_${dateFormatted}.${type}`;
  return fileName;
}
