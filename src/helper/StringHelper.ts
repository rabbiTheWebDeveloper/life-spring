export function trimCharStart(str: string, charlist: string): string {
	if (charlist === undefined) return str;

	return str.replace(new RegExp(`^[${charlist}]+`), "");
}

export function trimCharEnd(str: string, charlist: string): string {
	if (charlist === undefined) return str;

	return str.replace(new RegExp(`[${charlist}]+$`), "");
}

export function trimChar(str: string, charlist: string): string {
	let r = trimCharStart(str, charlist);
	r = trimCharEnd(r, charlist);
	return r;
}

export function ucFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string): string {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function snakeCase(str: string): string {
	return str?.toLowerCase().split(" ").join("_");
}

export function abbreviate(str: string, maxLength = 30): string {
	return `${str.substring(0, maxLength)}...`;
}

export function insertAt(src: string, position: number, target: string) {
	return src.slice(0, position) + target + src.slice(position);
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
	if (text && text.length > maxLength) {
		return `${text.substring(0, maxLength)}...`;
	}
	return text ?? "-";
}

export function padId(id: string | number | null) {
	return id?.toString().padStart(3, "0") ?? "";
}

export function formatMobileNumber(mobileString: string) {
  const numberWithoutCountryCode = mobileString.slice(4);

  const operatorCode = numberWithoutCountryCode.slice(0, 5);
  const remainingDigits = numberWithoutCountryCode.slice(5);

  let formattedRemainingDigits = '';
  if (remainingDigits) {
    formattedRemainingDigits = remainingDigits.match(/.{1,4}/g)?.join('-') || '';
  }

  const formattedMobileNumber = `+880 ${operatorCode}-${formattedRemainingDigits}`;

  return formattedMobileNumber;
}


export function getBMI(height?: number, weight?: number): string {
  if (height && weight) {
    const heightM = height / 100;
    const BMI = weight / (heightM * heightM);

    let status;
    if (BMI < 18.5) {
      status = "Underweight";
    } else if (BMI >= 18.5 && BMI < 25) {
      status = "Normal";
    } else if (BMI >= 25 && BMI < 30) {
      status = "Overweight";
    } else {
      status = "Obese";
    }

    return `${BMI.toFixed(2)}, ${status}`;
  }

  return "-";
}


export function cmToFeetInch(cm: number | undefined): string {

	if(!cm) return '-';

  const inch = 0.393701;
  const feet = 12;

  const totalInches = cm * inch;
  const feetValue = Math.floor(totalInches / feet);
  const inchesValue = Math.floor(totalInches % feet);

  return `${feetValue}' ${inchesValue}"`;
}


export function getFileType(url: string): 'pdf' | 'image' {
	if(!url) return 'pdf';

  const extension = url.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return 'pdf';
  } else {
    return 'image';
  }
}
