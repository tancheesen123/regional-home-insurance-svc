<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<head>
				<title></title>
				<style>
					ol { margin: 0; padding-left: 1.2em; }
					ul { margin: 0; padding-left: 1.2em; }
					table { border-collapse: separate; page-break-inside: auto; page-break-after: auto; width: 100%; }
					tr { page-break-inside: avoid; page-break-after: auto; }
				</style>
			</head>
			<body>
				<table border="0" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
					<tr>
						<td style="height: 50px; vertical-align: bottom;">
							<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
								សន្លឹកបង្ហាញព័ត៌មានផលិតផល
							</strong>
							<br /><br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								<strong>អតិថិជនជាទីគោរព,</strong>
								<br />
								សន្លឹកបង្ហាញព័ត៌មានផលិតផល (PDS) នេះត្រូវបានរចនាឡើង ដើម្បីផ្ដល់ព័ត៌មានសំខាន់ៗអំពី
								<strong>ធានារ៉ាប់រងម្ចាស់/អ្នករស់នៅផ្ទះ</strong> របស់លោក/លោកស្រី។ អតិថិជនផ្សេងទៀតបានអានសន្លឹកនេះ ហើយបានរកឃើញថាមានប្រយោជន៍ លោក/លោកស្រីក៏គួរតែអានវាផងដែរ។
							</span>
						</td>
						<td>
							<img alt="Etiqa Logo" height='160' style="text-align: center;">
								<xsl:attribute name="src"><xsl:value-of select="root/P_LogoImage" /></xsl:attribute>
							</img>
						</td>
					</tr>
					<tr>
						<td></td>
						<td style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: center;">
							<span>កាលបរិច្ឆេទ: <xsl:value-of select="root/P_PaymentDate" /></span>
						</td>
					</tr>
				</table>

				<img alt="Number1Image" height='20'>
					<xsl:attribute name="src"><xsl:value-of select="root/P_Number1Image" /></xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 ធានារ៉ាប់រងម្ចាស់/អ្នករស់នៅផ្ទះ គឺជាអ្វី?
				</strong>
				<br />
				<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
					ធានារ៉ាប់រងម្ចាស់/អ្នករស់នៅផ្ទះ ផ្ដល់ការការពារសម្រាប់អគារ (ទីលំនៅឯកជន) និងមាតិកានៃគ្រួសារ
					ព្រមទាំងទ្រព្យសម្បត្តិផ្ទាល់ខ្លួននៅក្នុងផ្ទះរបស់លោក/លោកស្រី។
				</span>
				<br /><br />

				<img alt="Number2Image" height='20'>
					<xsl:attribute name="src"><xsl:value-of select="root/P_Number2Image" /></xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 ស្គាល់ការការពាររបស់លោក/លោកស្រី
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td>
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								សម្រាប់រយៈពេលការការពារប្រចាំឆ្នាំ លោក/លោកស្រីនឹងទទួលបានការការពារធានារ៉ាប់រងដូចខាងក្រោម:
							</span>
							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">លរ.</th>
									<th style="width: 65%">ប្រភេទអត្ថប្រយោជន៍</th>
									<th style="width: 15%">ម្ចាស់ផ្ទះ<br />(អគារ)</th>
									<th style="width: 15%">អ្នករស់នៅ<br/>(មាតិកា)</th>
								</tr>
								<tr><td>1.</td><td style="text-align: justify;">អគ្គីភ័យ រន្ទះ និងការផ្ទុះដោយហ្គាសសម្រាប់ប្រើប្រាស់ក្នុងផ្ទះ</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>2.</td><td style="text-align: justify;">យន្តហោះ និងឧបករណ៍ចចោលតាមអាកាស ឬវត្ថុដែលធ្លាក់ចេញពីពួកវា</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>3.</td><td style="text-align: justify;">ការខូចខាតដោយការប៉ះទង្គិចនៃយានយន្ត ឬសត្វ</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>4.</td><td style="text-align: justify;">ការផ្ទុះ ឬការលើសព្រំដែននៃធុង ឧបករណ៍ ឬបំពង់ទឹក</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>5.</td><td style="text-align: justify;">ការលួចដោយការបំបែកចូល និងចេញពីផ្ទះដោយបង្ខំ និងហ្វ័រ</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>6.</td><td style="text-align: justify;">ព្យុះ ព្យុះចង្វាក់ ព្យុះតូហ្វង់ ខ្យល់ខ្លាំង</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>7.</td><td style="text-align: justify;">រញ្ជួយដី ឬការផ្ទុះភ្នំភ្លើង</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>8.</td><td style="text-align: justify;">ទឹកជំនន់</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>9.</td><td style="text-align: justify;">ការបាត់បង់ការជួល - កំណត់ 10% នៃចំនួនទឹកប្រាក់ធានារ៉ាប់រងសរុប</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>10.</td><td style="text-align: justify;">ទំនួលខុសត្រូវចំពោះភាគីទីបីសម្រាប់គ្រោះថ្នាក់នៅក្នុងផ្ទះ &#45; ដែនកំណត់ USD50,000</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>11.</td><td style="text-align: justify;">មាតិកាដែលបានដកចេញជាបណ្ដោះអាសន្នពីផ្ទះ &#45; កំណត់ 15% នៃចំនួនទឹកប្រាក់ធានារ៉ាប់រងសរុបលើមាតិកា</td><td>មិនការពារ</td><td>ការពារ</td></tr>
								<tr><td>12.</td><td style="text-align: justify;">ការខូចខាតដល់កញ្ចក់ លើកលែងតែកញ្ចក់ដៃ &#45; កំណត់ USD500 ក្នុងមួយដំណើករ</td><td>មិនការពារ</td><td>ការពារ</td></tr>
								<tr><td>13.</td><td style="text-align: justify;">ការសំណងករណីស្លាប់ដោយអគ្គីភ័យ ឬការប្លន់ &#45; កំណត់ USD10,000 ឬពាក់កណ្ដាលនៃចំនួនទឹកប្រាក់ធានារ៉ាប់រងលើមាតិកា ណាដែលទាបជាង</td><td>មិនការពារ</td><td>ការពារ</td></tr>
								<tr><td>14.</td><td style="text-align: justify;">ទ្រព្យសម្បត្តិអ្នករបស់ជួយការ</td><td>មិនការពារ</td><td>ការពារ</td></tr>
							</table>
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								ដោយការបង់បុព្វលាភបន្ថែម លោក/លោកស្រីអាចពង្រីកការការពារដើម្បីរួមបញ្ចូល:
							</span>
							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">លរ.</th>
									<th style="width: 65%">ប្រភេទអត្ថប្រយោជន៍</th>
									<th style="width: 15%">ម្ចាស់ផ្ទះ<br/>(អគារ)</th>
									<th style="width: 15%">អ្នករស់នៅ<br/>(មាតិកា)</th>
								</tr>
								<tr><td>1.</td><td style="text-align: justify;">ការបះបោរ កូដកម្ម និងការខូចខាតដោយចេតនាអាក្រក់</td><td>ការពារ</td><td>ការពារ</td></tr>
								<tr><td>2.</td><td style="text-align: justify;">ការទុកទំនេរលើសពីនិសិស្ស (90) ថ្ងៃ</td><td>មិនការពារ</td><td>ការពារ</td></tr>
								<tr><td>3.</td><td style="text-align: justify;">ការលួចដោយមិនបំបែកចូលដោយបង្ខំ មិនរួមបញ្ចូលការលួចដោយអ្នករបស់ជួយការ ឬសមាជិកគ្រួសារ</td><td>មិនការពារ</td><td>ការពារ</td></tr>
							</table>
							<br />
							<span><strong>ចំណាំ:</strong></span>
							<div style="text-align: justify">
								<ol>
									<li>សូមមើលកិច្ចសន្យាបណ្ណសន្យារ៉ាប់រងសម្រាប់ព័ត៌មានលម្អិតបន្ថែមអំពីអត្ថប្រយោជន៍ខាងលើ។</li>
									<li>រយៈពេលការការពារគឺមួយ (1) ឆ្នាំ។ លោក/លោកស្រីត្រូវបន្តបណ្ណសន្យារ៉ាប់រងរៀងរាល់ឆ្នាំ។</li>
									<li>អត្ថប្រយោជន៍ដែលត្រូវបង់ក្រោមផលិតផលដែលមានសិទ្ធិ ត្រូវបានការពារដោយ Perbadanan Insurans Deposit Malaysia (PIDM) ដល់ដែនកំណត់។ សូមមើលសៀវភៅណែនាំ PIDM's TIPS ឬទំនាក់ទំនងយើងខ្ញុំ ឬ PIDM (www.pidm.gov.my)។</li>
								</ol>
							</div>
							<br />
							<span><strong>បណ្ណសន្យារ៉ាប់រងរបស់លោក/លោកស្រីមិនគ្រប់ដណ្ដប់លើការខាតបង់មួយចំនួន ដូចជា:</strong></span>
							<ol>
								<li>ការខាតបង់ ឬការខូចខាតដោយការធ្លាក់ ការជម្លោះ ការបះបោរ កូដកម្ម និងការខូចខាតដោយចេតនាអាក្រក់;</li>
								<li>ការខាតបង់ ឬការខូចខាតដោយសង្គ្រាម សង្គ្រាមស៊ីវិល និងអំពើភេរវកម្ម;</li>
								<li>ការខាតបង់ ឬការខូចខាតដល់អគារ ប្រសិនបើទុកចោលលើសពី (90) ថ្ងៃ;</li>
								<li>ការខាតបង់ ឬការខូចខាតដោយហានិភ័យវិទ្យុសកម្ម និងថាមពលនុយក្លេអ៊ែរ។</li>
							</ol>
							<p><strong>ចំណាំ: </strong>បញ្ជីនេះមិនទូលំទូលាយ។ សូមមើលកិច្ចសន្យាបណ្ណសន្យារ៉ាប់រងសម្រាប់បញ្ជីការដកស្រង់ពេញ។</p>
						</td>
					</tr>
				</table>
				<br/>
				<div style="page-break-after: always"></div>

				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center; page-break-inside: avoid;">
					<tr>
						<td colspan="4" style="color: #000000; text-align: justify; vertical-align: top; border: none;">
							ប្រសិនបើលោក/លោកស្រីមានសំណួរ ឬត្រូវការជំនួយអំពីផលិតផលអាជ្ញាប័ណ្ណអ៊ីន​ស៊ូ​រ៉ង់ផ្ទះរបស់យើងខ្ញុំ លោក/លោកស្រីអាច:
						</td>
					</tr>
					<tr>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Phone" height='45'><xsl:attribute name="src"><xsl:value-of select="root/P_PhoneImage" /></xsl:attribute></img>
							<br />ទំនាក់ទំនងយើងខ្ញុំតាម 1-300-13-8888<br />(Etiqa Oneline)
						</td>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Website" height='45'><xsl:attribute name="src"><xsl:value-of select="root/P_WebsiteImage" /></xsl:attribute></img>
							<br />ចូលទស្សនា<br /><xsl:value-of select="root/P_WebsiteUrl" />
						</td>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Email" height='45'><xsl:attribute name="src"><xsl:value-of select="root/P_EmailImage" /></xsl:attribute></img>
							<br />ផ្ញើអ៊ីម៉ែលមក<br />info@etiqa.com.my
						</td>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="QR Code" height='80'><xsl:attribute name="src"><xsl:value-of select="root/P_QRCodeImage" /></xsl:attribute></img>
							<br />ស្កេន QR code
						</td>
					</tr>
				</table>
				<br/>

				<img alt="Number3Image" height='20'><xsl:attribute name="src"><xsl:value-of select="root/P_Number3Image" /></xsl:attribute></img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 ស្គាល់កាតព្វកិច្ចរបស់លោក/លោកស្រី
				</strong>
				<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; vertical-align: top; text-align: justify; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td colspan="2">
							<strong>
								សម្រាប់ធានារ៉ាប់រងម្ចាស់/អ្នករស់នៅផ្ទះនេះ បុព្វលាភដែលលោក/លោកស្រីត្រូវបង់ប្រចាំឆ្នាំ
								ត្រូវបានគណនាផ្អែកលើចំនួនទឹកប្រាក់ធានារ៉ាប់រង និងហានិភ័យបន្ថែមដែលបានជ្រើសរើស (ប្រសិនបើមាន)។ ជាឧទាហរណ៍ USD <xsl:value-of select="root/P_CoverageAmount" /> លោក/លោកស្រីត្រូវបង់:
							</strong>
						</td>
					</tr>
					<tr>
						<td>បុព្វលាភមូលដ្ឋានសម្រាប់ការការពារស្ដង់ដារ</td>
						<td>USD <xsl:value-of select="root/P_PlanPremium" /></td>
					</tr>
					<xsl:if test="root/P_HasAddOn = 'true'">
						<tr>
							<td>
								ការការពារបន្ថែម<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:value-of select="position()" />. <xsl:value-of select="Name" /><br />
								</xsl:for-each>
							</td>
							<td>
								<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:text>USD </xsl:text><xsl:value-of select="Premium" /><br />
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_HasAddOn = 'false'">
						<tr>
							<td>ការការពារបន្ថែម<br />មិនអនុវត្ត</td>
							<td><br />USD 0.00</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_IsCommissionAgency = 'false' and root/P_IsCommissionBanca = 'false'">
						<tr>
							<td>(-) បញ្ចុះតម្លៃសម្រាប់អតិថិជន</td>
							<td><xsl:value-of select="root/P_DiscountRate" />% ឬ USD <xsl:value-of select="root/P_DiscountAmount" /></td>
						</tr>
					</xsl:if>
					<tr>
						<td>បុព្វលាភសរុប</td>
						<td>USD <xsl:value-of select="root/P_NetPremium" /></td>
					</tr>
					<tr>
						<td colspan="2"><strong>លោក/លោកស្រីក៏ត្រូវបង់ថ្លៃ និងការប្រមូលដូចខាងក្រោម:</strong></td>
					</tr>
					<xsl:if test="root/P_IsCommissionAgency = 'true' or root/P_IsCommissionBanca = 'true'">
						<tr>
							<td>កម្រៃជើងសារដែលបង់ដល់អន្តរការី</td>
							<td><xsl:value-of select="root/P_CommissionRate" />% ឬ USD <xsl:value-of select="root/P_CommissionAmount" /></td>
						</tr>
					</xsl:if>
					<tr>
						<td>អាករសេវា</td>
						<td><xsl:value-of select="root/P_ServiceTaxRate" />% នៃបុព្វលាភសរុប ឬ USD <xsl:value-of select="root/P_ServiceTaxAmount" /></td>
					</tr>
					<tr>
						<td>ពន្ធត្រា</td>
						<td>USD <xsl:value-of select="root/P_StampDuty" /></td>
					</tr>
					<tr>
						<td>បុព្វលាភសរុបដែលត្រូវបង់</td>
						<td>USD <xsl:value-of select="root/P_TotalPremium" /></td>
					</tr>
					<tr>
						<td colspan="2">
							បុព្វលាភទាំងអស់ (ប្រសិនបើអនុវត្ត) នឹងត្រូវបន្ថែមនូវការបង់ ឬពន្ធពាក់ព័ន្ធ ដូចដែលចាំបាច់
							ដោយអាជ្ញាធរពន្ធកម្ពុជា។ វាជារឿងសំខាន់ក្នុងការរក្សាទុករូបិយប័ណ្ណ ឬបង្កាន់ដៃណាដែលលោក/លោកស្រីទទួល ជាភស្ដុតាងនៃការបង់បុព្វលាភ។
						</td>
					</tr>
				</table>
				<br />

				<img alt="Number4Image" height='20'><xsl:attribute name="src"><xsl:value-of select="root/P_Number4Image" /></xsl:attribute></img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 លក្ខខណ្ឌសំខាន់ៗផ្សេងទៀត
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
					<tr>
						<td>
							<div style="text-align: justify">
								<ol>
									<li>លោក/លោកស្រីត្រូវផ្ដល់ព័ត៌មានពេញលេញ និងត្រឹមត្រូវក្នុងអំឡុងពេលដាក់ពាក្យស្នើសុំ។</li>
									<li>ការការពារធានារ៉ាប់រងនឹងមានប្រសិទ្ធភាពតែពេលដែលលោក/លោកស្រីបានបង់បុព្វលាភ (សាច់ប្រាក់មុនការការពារ)។</li>
									<li>ការទាមទារទាំងអស់ត្រូវជូនដំណឹងដល់យើងខ្ញុំឱ្យបានឆាប់តែអាចធ្វើបាន ប៉ុន្តែមិនលើសពីសាមសិប (30) ថ្ងៃ បន្ទាប់ពីព្រឹត្តិការណ៍ណាដែលអាចផ្ដល់សិទ្ធិដល់លោក/លោកស្រីក្នុងការទាមទារ។</li>
									<li>តម្លៃទីផ្សារ
										<ol type="i">
											<li>លោក/លោកស្រីត្រូវប្រាកដថាអចលនទ្រព្យរបស់លោក/លោកស្រីបានធានារ៉ាប់រងឱ្យបានគ្រប់គ្រាន់ គ្រប់ពេលវេលា។</li>
											<li>ដើម្បីជួយក្នុងការកំណត់ចំនួនទឹកប្រាក់ធានារ៉ាប់រង លោក/លោកស្រីអាចប្រើ​ម៉ាស៊ីន​គណនា​ប្រមាណការអ​ចលន​ទ្រព្យ​ដែលផ្ដល់ដោយ PIAM។</li>
										</ol>
									</li>
									<li>មធ្យមភាគ &#45; ប្រសិនបើអចលនទ្រព្យដែលបានធានារ៉ាប់រងមានតម្លៃច្រើនជាងចំនួនទឹកប្រាក់ធានារ៉ាប់រង នោះលោក/លោកស្រីត្រូវចាត់ទុកជាម្ចាស់ធានារ៉ាប់រងខ្លួនឯងសម្រាប់ភាពខុសគ្នា។</li>
									<li>ហានិភ័យខ្លួនឯង &#45; ចំនួនទឹកប្រាក់ខាតបង់ដែលលោក/លោកស្រីត្រូវទទួលទុក ហើយអនុវត្តចំពោះហានិភ័យជាក់លាក់។</li>
									<li>ការការពារអ្នករស់នៅ &#45; ប្រសិនបើធាតុណាមួយក្នុងផ្ទះមានតម្លៃច្រើនជាង 5% នៃចំនួនទឹកប្រាក់ធានារ៉ាប់រងសរុប លោក/លោកស្រីគួរតែបញ្ជាក់ធាតុទាំងនោះដាច់ដោយឡែក។</li>
								</ol>
							</div>
							<p style="margin-top: 15px;"><strong>ចំណាំ: </strong>បញ្ជីនេះមិនទូលំទូលាយ។ សូមមើលកិច្ចសន្យាបណ្ណសន្យារ៉ាប់រងសម្រាប់បញ្ជីលក្ខខណ្ឌពេញ។</p>
						</td>
					</tr>
				</table>
				<br />

				<img alt="Red Question Mark" height='20'><xsl:attribute name="src"><xsl:value-of select="root/P_QuestionMarkImage" /></xsl:attribute></img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					តើខ្ញុំអាចលុបចោលបណ្ណសន្យារ៉ាប់រងបានទេ?
				</strong>
				<br />
				<div style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: justify;">
					បាទ/ចាស។ លោក/លោកស្រីអាចលុបចោលបណ្ណសន្យារ៉ាប់រងរបស់លោក/លោកស្រីនៅពេលណាក៏បានដោយការជូនដំណឹងជាលាយលក្ខណ៍អក្សរដល់យើងខ្ញុំ។ នៅពេលលុបចោល លោក/លោកស្រីមានសិទ្ធិទទួលការសងប្រាក់មួយផ្នែកនៃបុព្វលាភ ដោយលក្ខខណ្ឌថាលោក/លោកស្រីមិនបានដាក់ការទាមទារ។
				</div>
			</body>
			<footer style="position: fixed; bottom: 0; right: 15px; color: gray; font-size: 12px; background: transparent;">
				PMG/EGIB/HOHH/PDS/KH/2601V0.1
			</footer>
		</html>
	</xsl:template>
</xsl:stylesheet>
