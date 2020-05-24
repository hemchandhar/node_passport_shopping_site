var Product = require('../models/Product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/appdb',{useNewUrlParser:true})
	.then(() =>console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

var products=[ 
	new Product({
		image_path:'https://rukminim1.flixcart.com/image/416/416/jz7az680/computer/b/3/k/lenovo-na-laptop-original-imafj9wscwkeyu45.jpeg?q=70',
		name:'Lenevo ideapad 130',
		description:'Core i5 8th Gen - (8 GB/1 TB HDD/Windows 10 Home/2 GB Graphics) 130-15IKB Laptop  (15.6 inch, Black, 2.1 kg)',
		price:39990
	}),
	new Product({
		image_path:'https://rukminim1.flixcart.com/image/416/416/k33c4nk0pkrrdj/computer/y/h/k/acer-na-thin-and-light-laptop-original-imafhnvjheyngmvq.jpeg?q=70',
		name:'Acer Swift 3',
		description:'Core i5 8th Gen - (8 GB/512 GB SSD/Windows 10 Home/2 GB Graphics) SF314-55G Thin and Light Laptop  (14 inch, Sparkly Silver, 1.35 kg)',
		price:49990
	}),
	new Product({
		image_path:'https://rukminim1.flixcart.com/image/416/416/k391w280/computer/x/a/h/asus-na-original-imafmewrxvc7ygmb.jpeg?q=70',
		name:'Asus VivoBook 14',
		description:'Ryzen 5 Quad Core 2nd Gen - (8 GB/512 GB SSD/Windows 10 Home) X412DA-EK502T Thin and Light Laptop  (14 inch, Slate Grey, 1.5 kg)',
		price:37990
	}),
	new Product({
		image_path:'https://rukminim1.flixcart.com/image/416/416/jsnjbm80/computer/j/8/c/apple-na-thin-and-light-laptop-original-imafe6f78hur4jbh.jpeg?q=70',
		name:'Apple MacBook Air',
		description:'Core i5 5th Gen - (8 GB/128 GB SSD/Mac OS Sierra) MQD32HN/A A1466  (13.3 inch, Silver, 1.35 kg)',
		price:64990
	}),
	new Product({
		image_path:'https://rukminim1.flixcart.com/image/416/416/jwfa5jk0/computer/n/3/k/hp-na-laptop-original-imafh42uzzw4qhf2.jpeg?q=70',
		name:'HP 14q',
		description:'Core i5 8th Gen - (8 GB/1 TB HDD/Windows 10 Home) 14q-cs0017tu Laptop  (14 inch, Smoke Grey, 1.47 kg, With MS Office)',
		price:41990
	}),
	new Product({
		image_path:'https://rukminim1.flixcart.com/image/416/416/k5lcvbk0/computer/8/p/y/dell-na-laptop-original-imafz8txjfajhejy.jpeg?q=70',
		name:'Dell Inspiron 15',
		description:'3000 Core i5 8th Gen - (4 GB/1 TB HDD/Linux/2 GB Graphics) 3567 Laptop  (15.6 inch, Black, 2.2 kg)',
		price:38390
	}),
	new Product({
		image_path:'https://rukminim1.flixcart.com/image/416/416/k0sgl8w0/computer/r/y/u/msi-original-imafkggzkgwhh3nj.jpeg?q=70',
		name:'MSI Modern 14',
		description:'Core i5 10th Gen - (8 GB/512 GB SSD/Windows 10 Home) A10M-652IN Thin and Light Laptop  (14 inch, Silver, 1.19 kg)',
		price:54990
	})
];

var d=0;
for(let i=0;i<products.length;i++){
	products[i].save(function(err,result){
		d++;
		if(d === products.length){
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();	
}
