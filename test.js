const datamiss = [
	{
		"RegisterId": 2,
		"TermId": 4,
		"GradeId": 7,
		"InvoiceNumber": 2,
		"Fname": "ນ້ອຍ",
		"Lname": "ນັນທະວົງ",
		"Gender": "male",
		"PaidBy": "ນ້ອຍ",
		"ReceivedBy": 39,
		"Date": "2023-06-12T17:00:00.000Z",
		"Time": "13:47:43",
		"StatusPayment": "paidbyed",
		"Remark": "",
		"GradeName": "7",
		"TermName": "2022-2023",
		"ClassroomId": 20,
		"ClassroomName": "7/1",
		"MemberId": 2,
		"StudentId": 2,
		"RmemberId": 2,
		"MissClassId": 4,
		"TeacherroomId": 1,
		"Month": 2,
		"HourNoReason": 5,
		"HourReason": 2
	},
	{
		"RegisterId": 3,
		"TermId": 4,
		"GradeId": 7,
		"InvoiceNumber": 3,
		"Fname": "ກົ້ງເມັ່ງ",
		"Lname": "ວ່າງ",
		"Gender": "male",
		"PaidBy": "ກົ້ງເມັ່ງ",
		"ReceivedBy": 39,
		"Date": "2023-06-12T17:00:00.000Z",
		"Time": "13:48:14",
		"StatusPayment": "paidbyed",
		"Remark": null,
		"GradeName": "7",
		"TermName": "2022-2023",
		"ClassroomId": 20,
		"ClassroomName": "7/1",
		"MemberId": 3,
		"StudentId": null,
		"RmemberId": 3,
		"MissClassId": 5,
		"TeacherroomId": 1,
		"Month": 1,
		"HourNoReason": 3,
		"HourReason": 0
	}
]


const result = datamiss.map((item) => {
	let month = item.Month;
	if (month >= 1 && month <= 7) {
	  month += 12;
	}
	
	if (month >= 9 && month <= 12) {
	  month -= 8;
	}
	if (month >= 7) {
		return item;
	  }
	return {
	  ...item,
	  MemberId: 0,
	  StudentId: 0,
	  RmemberId: 0,
	  MissClassId: 0,
	  TeacherroomId: 0,
	  Month: 0,
	  HourNoReason: 0,
	  HourReason: 0,
	};
  });
  
  console.log(result);
  