<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<body>
				<div style="justify-content: space-between">
					<div style="height:165px">
						<table>
							<tr style="height:0.2px"></tr>
						</table>
						<img
							height="115px"
					  style="float:right;padding-right:12px;"
          >
							<xsl:attribute name="src">
								<xsl:value-of select="root/ImageEgibEnHeader"/>
							</xsl:attribute>
						</img>
					</div>
					<div
					  style="
                padding-left: 30px;
                padding-right: 30px;
                text-align: justify;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1.1499023;
              "
            >
						<p style="font-size: 16px; padding-bottom: 10px">
							កាលបរិច្ឆេទ :
							<span style="padding-left: 5px"
                  >
								<xsl:value-of select="root/P_Date"
                />
							</span>
						</p>
						<p style="font-size: 20px; margin-block-end: 30px">
							<xsl:value-of select="root/P_Name" />
						</p>
						<p
						  style="
                  margin-block-end: 0px;
                  margin-block-start: 0px;
                  font-size: 16px;
                  padding: 2px;
                  padding-left: 0px;
                "
              >
							<xsl:value-of select="root/P_Address1" />
						</p>
						<p
						  style="
                  margin-block-end: 0px;
                  margin-block-start: 0px;
                  font-size: 16px;
                "
              >
							<xsl:value-of select="root/P_Address2" />
						</p>
						<p
						  style="
                  margin-block-end: 0px;
                  margin-block-start: 0px;
                  font-size: 16px;
                "
              >
							<xsl:value-of select="root/P_Address3" />
						</p>
						<p
						  style="
                  margin-block-end: 60px;
                  margin-block-start: 0px;
                  font-size: 16px;
                "
              >
							<xsl:value-of select="root/P_Address4" />
						</p>
						<p style="font-size: 18px; margin-block-end: 25px">
							<u>
								អរគុណចំពោះការបន្តទុកចិត្តលើ ETIQA ។ យើងខ្ញុំសូមជូនដំណឹងដ៏រីករាយថា ការគ្រប់គ្រងរបស់លោក/លោកស្រីបានចូលជាធរមានហើយ
							</u>
						</p>
						<table style="width:100%;text-align:justify">
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">លេខបណ្ណសន្យារ៉ាប់រង</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center;text-align:left;">ឈ្មោះគម្រោង</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_CoverTypeName" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">រយៈពេល</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PeriodofInsurance" />
								</td>
							</tr>
						</table>
						<hr style="border-style: solid" />
						<p style="font-size: 16px; margin-block-end: 20px">
							យើងខ្ញុំសូមភ្ជាប់មកនូវឯកសារខាងក្រោមសម្រាប់ការអនុម័តរបស់លោក/លោកស្រី:-
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							កាលវិភាគបណ្ណសន្យារ៉ាប់រង
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							ឯកសារសំខាន់នេះសង្ខេបព័ត៌មានលម្អិតនៃបណ្ណសន្យារ៉ាប់រងរបស់លោក/លោកស្រី ហើយយើងខ្ញុំស្នើឱ្យរក្សាទុកឯកសារនេះសម្រាប់ជាឯកសារយោង។ សូមជ្រាបថា ព័ត៌មានដែលបានបញ្ជាក់នៅក្នុងកាលវិភាគបណ្ណសន្យារ៉ាប់រងគឺផ្អែកលើព័ត៌មានដែលលោក/លោកស្រីបានប្រកាសដល់យើងខ្ញុំក្នុងពេលដាក់ពាក្យស្នើសុំ។ យើងខ្ញុំណែនាំឱ្យពិនិត្យមើលឯកសារនេះដោយប្រុងប្រយ័ត្ន ហើយប្រសិនបើមានភាពខុសគ្នាណាមួយ សូមជូនដំណឹងដល់យើងខ្ញុំភ្លាម។ អ្នកប្រឹក្សារបស់យើងខ្ញុំត្រៀមខ្លួនបម្រើជូនដោយរីករាយ។
						</p>
						<p style="font-size: 16px; margin-block-end: 20px">
							សម្រាប់សំណួរណាមួយអំពីខាងលើ ឬផលិតផលរបស់យើងខ្ញុំ អ្នកអាចទំនាក់ទំនងមកកាន់ Etiqa Oneline តាមរយៈ 1 300 13 8888 ឬផ្ញើអ៊ីម៉ែលមកកាន់ info@etiqa.com.my ។ ក្នុងករណីទាមទារសំណង អ្នកអាចហៅទូរស័ព្ទមកកាន់ Claim Assist តាមលេខ 1 300 88 1007 សម្រាប់សេវាកម្មទាមទារសំណងឆាប់រហ័ស។ សូមមកចូលរួមក្នុងក្រុមគ្រួសារ Etiqa ។
						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							អរគុណ។
						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							សូមទទួលការគោរព, <br />Etiqa General Insurance Berhad
						</p>

						<p style="font-size:16px; margin-block-start:30px">
							អត្ថប្រយោជន៍ដែលត្រូវបង់ក្រោមបណ្ណសន្យារ៉ាប់រងដែលមានសិទ្ធិត្រូវបានការពារដោយ PIDM រហូតដល់ដែនកំណត់។ សូមយោងទៅ <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my/en/how-we-protect-you/tips/information-materials/brochures">
								<i>សៀវភៅណែនាំ PIDM's TIPS</i>
							</a> ឬទំនាក់ទំនង Etiqa General Insurance Berhad ឬ PIDM (សូមចូលទស្សនា <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my">www.pidm.gov.my</a>)។
						</p>
						<br/>
						<br/>
						<p>
							កាលបរិច្ឆេទចេញ: <xsl:value-of select="root/P_Date"/><br/>
							ចេញដោយ : <xsl:value-of select="root/P_AgentCode"/>
						</p>
					</div>
				</div>

				<div style="page-break-after: always"></div>

				<!--Second page-->
				<div style="height:165px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibEnHeader"/>
						</xsl:attribute>
					</img>
				</div>
				<div
				  style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<!--Header-->
					<div style="display: flex; justify-content: space-between">
						<div style="flex: 1;padding-top: 0px;">
							<p style="margin-block-start: 10px;font-size: 18px;padding-right:30px;font-family: Arial, Helvetica, sans-serif;">
								កាលវិភាគ
							</p>
						</div>
						<div style="flex: 1;padding-top: 0px;">
							<p style="margin-block-start: 10px;font-size: 18px;text-align:right;font-family: Arial, Helvetica, sans-serif; border: 2px solid black; padding: 5px; margin-left:300px;">
								បានបង់ពន្ធត្រា
							</p>
						</div>
					</div>

					<!--1st table-->
					<div style="display: flex; justify-content: space-between;font-size:16px;">
						<div style="flex:1; flex-basis: 40%; border: 2px solid black;padding-left:5px; text-align: left;">
							<p style="font-size: 16px; margin:5px;margin-bottom:10px;">
								<xsl:value-of select="root/P_Name" />
							</p>
							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address1" />
							</p>
							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address2" />
							</p>

							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address3" />
							</p>

							<p style="font-size: 16px; margin:5px;">
								<xsl:value-of select="root/P_Address4" />
							</p>
							<p style="font-size: 16px; margin:5px;">

							</p>
						</div>
						<div style="flex:1;flex-basis: 60%;border: 2px solid black; border-left: 0px solid black;padding-left:5px;">
							<table style="width:100%; font-size:16px;">
								<tr>
									<td style="width:35%">លេខបណ្ណសន្យារ៉ាប់រង</td>
									<td style="width:3%">:</td>
									<td style="width:62%">
										<xsl:value-of select="root/P_PolicyNo" />
									</td>
								</tr>
								<tr>
									<td>លេខគណនី</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_AgentCode" />
									</td>
								</tr>
								<tr>
									<td>ប្រភេទផលិតផល</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_CoverTypeName" />
									</td>
								</tr>
								<tr>
									<td colspan="3">
										<p style="text-align: justify; padding-top:5px;">
											រយៈពេលធានារ៉ាប់រងចាប់ពី <xsl:value-of select="root/P_StartDate" /> ដល់ <xsl:value-of select="root/P_EndDate" /> (រួមបញ្ចូលទាំងកាលបរិច្ឆេទទាំងពីរ)។ រយៈពេលបន្តណាមួយដែលម្ចាស់បណ្ណសន្យារ៉ាប់រងនឹងបង់ ហើយក្រុមហ៊ុនធានារ៉ាប់រងយល់ព្រមទទួលបុព្វលាភ។
										</p>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div style="height: 10px">
					</div>
					<!--2nd table-->
					<div style="border: 2px solid black; padding-left:5px;">
						<table style="width:100%; font-size:16px; ">
							<tr style="height: 30px;">
								<td style="width:45%;">ចំនួនទឹកប្រាក់ធានារ៉ាប់រងសរុប</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">USD</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_TotalSumInsured" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">បុព្វលាភមូលដ្ឋាន</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">USD</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_AnnualPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">អត្ថប្រយោជន៍បន្ថែម:</td>
								<td style="width:5%"></td>
								<td style="width:20%; text-align: right;"></td>
								<td style="width:30%; text-align: right;"></td>
							</tr>
							<xsl:for-each select="root/P_AddOnItem/AddOnItem">
								<tr style="height: 30px;">
									<td style="width:45%;">
										<xsl:value-of select="Name" />
									</td>
									<td style="width:5%">:</td>
									<td style="width:20%; text-align: right;">USD</td>
									<td style="width:30%; text-align: right;">
										<xsl:value-of select="Price" />
									</td>
								</tr>
							</xsl:for-each>
							<tr style="height: 30px;">
								<td style="width:45%;">បុព្វលាភសរុបរួម</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">USD</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									បញ្ចុះតម្លៃ (<xsl:value-of select="root/P_DiscountRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">(-) USD</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Discount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">បុព្វលាភសរុបរួមបន្ទាប់ពីបញ្ចុះតម្លៃ</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">USD</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremiumAfterDiscount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									អាករសេវា (<xsl:value-of select="root/P_TaxRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">USD</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Tax" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">ពន្ធត្រា</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">USD</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_StampDuty" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">បុព្វលាភសរុប</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;border-top: 2px solid black;">USD</td>
								<td style="width:30%; text-align: right;border-top: 2px solid black;">
									<xsl:value-of select="root/P_Total" />
								</td>
							</tr>
						</table>
					</div>

					<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
						<table style="width:100%; font-size:16px">
							<tr style="height: 40px;">
								<td style="width:45%;">លេខហានិភ័យ</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_RiskNo" />
								</td>
							</tr>
							<tr style="height: 40px;">
								<td style="width:45%;">លេខយោង IP</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;"></td>
							</tr>
							<tr>
								<td style="width:45%;">ទីតាំងហានិភ័យ</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress1" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress2" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress3" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_PropertyAddress4" />
								</td>
							</tr>
							<tr>
								<td style="width:45%;"></td>
								<td style="width:5%"></td>
								<td style="width:50%; text-align: left;">

								</td>
							</tr>

						</table>
					</div>

				</div>
				<table>
					<tr style="height: 28px"></tr>
				</table>
				<div style="page-break-after: always"></div>

				<!--3rd page-->
				<div style="height:165px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibEnHeader" />
						</xsl:attribute>
					</img>
				</div>
				<div style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          ">

					<!--1st table-->
					<xsl:choose>
						<xsl:when test="root/P_isBuilding = 'true'">
							<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">ការចាត់ថ្នាក់សំណង់ </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">ប្រើប្រាស់ជា </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">ប្រភេទការគ្រប់គ្រង </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">ប្រភេទអត្រា </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">អត្រាតារីហ្វ</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">អត្រា (%) </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingRate" />
										</td>
									</tr>
								</table>

								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;vertical-align:top;">ធាតុ </td>
										<td style="width:40%;vertical-align:top;" colsapn="2">ការពិពណ៌នាអំពីអចលនទ្រព្យ / ផលប្រយោជន៍ធានារ៉ាប់រង</td>

										<td style="width:15%; text-align: right;vertical-align:top;" colspan="2">ចំនួនទឹកប្រាក់ធានារ៉ាប់រង</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;vertical-align:top;">1 </td>
										<td style="width:5%;vertical-align:top;">លើអគារមួយ</td>
										<td style="width:5%;vertical-align:top;">USD</td>
										<td style="text-align:right;vertical-align:top;">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">សរុប:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">USD</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">ហានិភ័យខ្លួនឯង </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">គ្មាន</td>
									</tr>

								</table>
							</div>
						</xsl:when>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="root/P_isContent = 'true'">
							<!--2nd table-->
							<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">ការចាត់ថ្នាក់សំណង់ </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">ប្រើប្រាស់ជា </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">ប្រភេទការគ្រប់គ្រង </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">ប្រភេទអត្រា </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">អត្រាតារីហ្វ</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">អត្រា (%) </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ContentRate" />
										</td>
									</tr>
								</table>

								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;vertical-align:top;">ធាតុ </td>
										<td style="width:40%;vertical-align:top;" colsapn="2">ការពិពណ៌នាអំពីអចលនទ្រព្យ / ផលប្រយោជន៍ធានារ៉ាប់រង</td>

										<td style="width:15%; text-align: right;vertical-align:top;" colspan="2">ចំនួនទឹកប្រាក់ធានារ៉ាប់រង</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;vertical-align:top;">1 </td>
										<td style="width:5%;vertical-align:top;">លើមាតិកា</td>
										<td style="width:5%;vertical-align:top;">USD</td>
										<td style="text-align:right;vertical-align:top;">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">សរុប:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">USD</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">ហានិភ័យខ្លួនឯង </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">គ្មាន</td>
									</tr>

								</table>

							</div>
						</xsl:when>
					</xsl:choose>
					<!--Home Content Declaration-->
					<xsl:choose>
						<xsl:when test="root/P_isContentDeclaration = 'true'">
							<table style="width:100%; padding-top:20px; border:2px solid black; margin-top:5px;">
								<tr>
									<td style="width:10%;">
										<u>ធាតុ</u>
									</td>
									<td style="width:20%;">
										<u>ប្រភេទ</u>
									</td>
									<td style="width:40%;">
										<u>ការពិពណ៌នាអំពីអចលនទ្រព្យ / ផលប្រយោជន៍ធានារ៉ាប់រង</u>
									</td>
									<td style="width:25%;">
										<u>តម្លៃបញ្ជាក់</u>
									</td>
									<td style="width:10%;"></td>
								</tr>
								<xsl:for-each select="root/P_ContentDeclaration/ContentDeclarationItem">
									<tr>
										<td style="width:10%;">
											<xsl:value-of select="Number" />
										</td>
										<td style="width:20%;">
											<xsl:value-of select="DeclarationType" />
										</td>
										<td style="width:40%;">
											<xsl:value-of select="Description" />
										</td>
										<td style="width:25%;">USD</td>
										<td style="width:10%;">
											<xsl:value-of select="Value" />
										</td>
									</tr>
								</xsl:for-each>
								<xsl:choose>
									<xsl:when test="root/P_needAdditionalPage = 'false'">
										<tr style="height:30px;"></tr>
										<tr style="height:35px;">
											<td style="width:10%;"></td>
											<td style="width:20%;"></td>
											<td style="width:40%; text-align:right; padding-right:20px;">សរុប:</td>
											<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">USD</td>
											<td style="width:10%;border-top:2px dashed black;border-bottom:2px dashed black">
												<xsl:value-of select="root/P_TotalContentDeclaration" />
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
							</table>
						</xsl:when>
					</xsl:choose>

				</div>
				<table>
					<tr style="height: 28px"></tr>
				</table>
				<div style="page-break-after: always"></div>

				<!--3+1 Additional Page-->
				<xsl:choose>
					<xsl:when test="root/P_needAdditionalPage = 'true'">
						<div style="height:140px">
							<table>
								<tr style="height:0.2px"></tr>
							</table>
							<img
								height="115px"
						  style="float:right;margin-right:-21px"
          >
								<xsl:attribute name="src">
									<xsl:value-of select="root/ImageEgibEnHeader"/>
								</xsl:attribute>
							</img>
						</div>
						<div
			 style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
							<table style="width:100%; padding-top:20px;border:2px solid black;">
								<xsl:for-each select="root/P_ContentDeclaration2/ContentDeclarationItem2">
									<tr>
										<td style="width:10%;">
											<xsl:value-of select="Number" />
										</td>
										<td style="width:20%;">
											<xsl:value-of select="DeclarationType" />
										</td>
										<td style="width:40%;">
											<xsl:value-of select="Description" />
										</td>
										<td style="width:25%;">USD</td>
										<td style="width:10%;">
											<xsl:value-of select="Value" />
										</td>
									</tr>
								</xsl:for-each>
								<tr style="height:30px;"></tr>
								<tr style="height:35px;">
									<td style="width:10%;"></td>
									<td style="width:20%;"></td>
									<td style="width:40%; text-align:right; padding-right:20px;">សរុប:</td>
									<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">USD</td>
									<td style="width:10%;border-top:2px dashed black;border-bottom:2px dashed black">
										<xsl:value-of select="root/P_TotalContentDeclaration" />
									</td>
								</tr>
							</table>
						</div>
						<div style="page-break-after: always"></div>
					</xsl:when>
				</xsl:choose>

				<!--4th page-->
				<div
				  style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<div style="height:140px">
						<table>
							<tr style="height:0.2px"></tr>
						</table>
						<img
							height="115px"
					  style="float:right;margin-right:-21px"
          >
							<xsl:attribute name="src">
								<xsl:value-of select="root/ImageEgibEnHeader"/>
							</xsl:attribute>
						</img>
					</div>
					<div style="border: 1px solid black; padding: 10px;">
						<p>ស្ថិតក្រោមការធានា បណ្តាំ និងខកចំណាំដែលបានបញ្ចូលនៅទីនេះ ហើយជាផ្នែកមួយនៃ e-Policy:</p>
						<table style="width: 100%; border-collapse: collapse;">
							<thead>
								<tr>
									<th style="text-align: left; padding: 5px;">លេខកូដខកចំណាំ</th>
									<th style="text-align: left; padding: 5px;">ឈ្មោះខកចំណាំ/ហានិភ័យ</th>
									<th style="text-align: left; padding: 5px;">អត្រា</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style="padding: 5px;">C008</td>
									<td style="padding: 5px;">ខកចំណាំការដកស្រង់មូលដ្ឋានគ្រឹះ</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C42B</td>
									<td style="padding: 5px;">ការទទួលស្គាល់កាលបរិច្ឆេទ (សម្រាប់បណ្ណសន្យារ៉ាប់រងម្ចាស់ផ្ទះ / អ្នករស់នៅផ្ទះប៉ុណ្ណោះ)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C045</td>
									<td style="padding: 5px;">ខកចំណាំបំភ្លឺការខូចខាតទ្រព្យសម្បត្តិ</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">W026</td>
									<td style="padding: 5px;">ការធានាបុព្វលាភ</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">M002</td>
									<td style="padding: 5px;">ព័ត៌មានអំពី IMB/CSB (តាមការជូនដំណឹងសំខាន់ភ្ជាប់)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C046</td>
									<td style="padding: 5px;">ខកចំណាំការដកស្រង់ Asbestos (អនុវត្តចំពោះផ្នែក IIIB ប៉ុណ្ណោះ)</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C047</td>
									<td style="padding: 5px;">ខកចំណាំការដកស្រង់ហានិភ័យវិទ្យុសកម្ម/ថាមពលនុយក្លេអ៊ែរ</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">W001</td>
									<td style="padding: 5px;">ការធានារំឡូយទំនិញ</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C049</td>
									<td style="padding: 5px;">ខកចំណាំការចែកចាយធានារ៉ាប់រង និងលើស</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">M007</td>
									<td style="padding: 5px;">ការដកស្រង់តាមអ៊ីនធឺណិត និងទិន្នន័យ</td>
									<td style="padding: 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 5px;">C051</td>
									<td style="padding: 5px;">បណ្តាំជំងឺឆ្លង</td>
									<td style="padding: 5px;"></td>
								</tr>

								<xsl:choose>
									<xsl:when test="root/P_IsRsmdAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_RsmdAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_RsmdAddOnName"/>
											</td>
											<td style="padding: 5px;">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa != 'true'">
														<xsl:value-of select="root/P_RsmdAddOnRate"/>%
													</xsl:when>
												</xsl:choose>
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsExtendedTheftAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnName"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnRate"/>%
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsSubsidenceAndLandslideAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_SubsidenceAndLandslideAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_SubsidenceAndLandslideAddOnName"/>
											</td>
											<td style="padding: 5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsDamagesByFailingTreeAddOnExist = 'true'">
										<tr>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_DamagesByFailingTreeAddOnCode"/>
											</td>
											<td style="padding: 5px;">
												<xsl:value-of select="root/P_DamagesByFailingTreeAddOnName"/>
											</td>
											<td style="padding: 5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
							</tbody>
						</table>

						<p style="margin-top: 20px;">ការដកស្រង់តាមអ៊ីនធឺណិត និងទិន្នន័យ</p>
						<p>មិនគិតដល់បទប្បញ្ញត្តិណាមួយដែលផ្ទុយគ្នានៅក្នុងបណ្ណសន្យារ៉ាប់រងនេះ ឬបណ្តាំណាមួយ បណ្ណសន្យារ៉ាប់រងនេះដកស្រង់ណាមួយ:</p>
						<p>
							1.1 ការខាតបង់តាមអ៊ីនធឺណិត:<br/>
						</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1.2 </td>
							<td style="text-align: justify;">
								ការខាតបង់ ការខូចខាត ទំនួលខុសត្រូវ ការទាមទារ ការចំណាយ ឬការចំណាយណាមួយដែលបណ្តាលដោយផ្ទាល់ ឬដោយប្រយោលដោយ ចូលរួម ឬបណ្តាលមកពី ក្នុងទំនាក់ទំនងជាមួយការបាត់បង់ការប្រើប្រាស់ ការថយចុះមុខងារ ការជួសជុល ការជំនួស ការស្ដារ ឬការផលិតឡើងវិញនូវទិន្នន័យណាមួយ រួមទាំងចំនួនទឹកប្រាក់ណាមួយដែលទាក់ទងនឹងតម្លៃនៃទិន្នន័យបែបនេះ ដោយមិនគិតដល់មូលហេតុ ឬព្រឹត្តិការណ៍ផ្សេងទៀតដែលរួមចំណែក ក្នុងពេលណាមួយ ឬជាលំដាប់ផ្សេងទៀត។ ក្នុងករណីផ្នែកណាមួយនៃបណ្តាំនេះត្រូវបានគេរកឃើញថាមិនត្រឹមត្រូវ ឬមិនអាចអនុវត្តបាន ផ្នែកដែលនៅសល់នឹងនៅសក្ដិសិទ្ធិ និងមានប្រសិទ្ធភាព។ បណ្តាំនេះជំនួស ហើយប្រសិនបើមានជម្លោះជាមួយអត្ថន័យផ្សេងទៀតនៅក្នុងធានារ៉ាប់រង ឬបណ្តាំណាមួយដែលទាក់ទងនឹងការខាតបង់តាមអ៊ីនធឺណិត ឬទិន្នន័យ ជំនួសអត្ថន័យនោះ។
							</td>

						</table>

						<p style="margin-top: 20px;">និយមន័យ</p>
						<p>
							ការខាតបង់តាមអ៊ីនធឺណិត មានន័យថា ការខាតបង់ ការខូចខាត ទំនួលខុសត្រូវ ការទាមទារ ការចំណាយ ឬការចំណាយណាមួយដែលបណ្តាលដោយផ្ទាល់ ឬដោយប្រយោលដោយ ចូលរួម ឬបណ្តាលមកពី ក្នុងទំនាក់ទំនងជាមួយការប្រព្រឹត្តតាមអ៊ីនធឺណិត ឬឧប្បត្តិហេតុតាមអ៊ីនធឺណិតណាមួយ រួមទាំង ប៉ុន្តែមិនកំណត់ចំពោះ ការចាត់វិធានការណ៍ណាមួយដើម្បីគ្រប់គ្រង ការពារ ការបង្ក្រាប ឬការជួសជុលការប្រព្រឹត្ត ឬឧប្បត្តិហេតុតាមអ៊ីនធឺណិតណាមួយ។
						</p>

						<p>ឧប្បត្តិហេតុតាមអ៊ីនធឺណិត មានន័យថា:</p>
						<ol style="margin-left: 10px;">
							<li>កំហុស ឬការលុបចោល ឬស៊េរីនៃកំហុស ឬការលុបចោលដែលទាក់ទងនឹងការចូលប្រើ ការដំណើរការ ការប្រើប្រាស់ ឬការដំណើរការប្រព័ន្ធកុំព្យូទ័រណាមួយ; ឬ</li>
							<li>ភាពមិនអាចប្រើបានទាំងផ្នែក ឬទាំងស្រុង ឬការខ្វះខាត ឬស៊េរីនៃភាពមិនអាចប្រើបានទាំងផ្នែក ឬទាំងស្រុង ដើម្បីចូលប្រើ ដំណើរការ ប្រើប្រាស់ ឬដំណើរការប្រព័ន្ធកុំព្យូទ័រណាមួយ។</li>
						</ol>

						<p>ប្រព័ន្ធកុំព្យូទ័រ មានន័យថា:</p>
						<p>កុំព្យូទ័រ ហាតវែរ សូហ្វវែរ ប្រព័ន្ធទំនាក់ទំនង ឧបករណ៍អេឡិចត្រូនិក (រួមទាំង ប៉ុន្តែមិនកំណត់ចំពោះ ស្មាតហ្វូន កុំព្យូទ័រយួរដៃ ថេប្លេត ឧបករណ៍ស្ករ ម៉ាស៊ីនបម្រើ ពពក ឬម៉ីក្រូកុំព្យូទ័រ) រួមទាំងប្រព័ន្ធ ឬការរចនាណាមួយដូចគ្នា ហើយរួមទាំងការបញ្ចូល លទ្ធផល ឧបករណ៍ផ្ទុកទិន្នន័យ ឧបករណ៍បណ្តាញ ឬមធ្យោបាយបម្រុងណាមួយ ដែលជាកម្មសិទ្ធ ឬដំណើរការដោយអ្នកធានា ឬដោយភាគីផ្សេងទៀត។</p>

						<p style="padding-bottom:50px;">ទិន្នន័យ មានន័យថា ព័ត៌មាន ការពិត គំនិត លេខកូដ ឬព័ត៌មានផ្សេងទៀតណាមួយដែលត្រូវបានកត់ត្រា ឬបញ្ជូនក្នុងទម្រង់ដើម្បីប្រើ ចូល ដំណើរការ បញ្ជូន ឬផ្ទុកដោយប្រព័ន្ធកុំព្យូទ័រ។</p>
					</div>

				</div>
				<table>
					<tr style="height:30px"></tr>
				</table>
				<div style="page-break-after: always"></div>

				<!--5th page-->
				<div style="height:150px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibEnHeader" />
						</xsl:attribute>
					</img>
				</div>
				<div style="
        padding-left: 30px;
        padding-right: 30px;
        text-align: justify;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.1499023;
      ">
					<div style="border: 1px solid black; padding: 10px;">
						<p style="text-align: left; margin-bottom: 20px;">បណ្តាំជំងឺឆ្លង</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1. </td>
							<td style="text-align: justify;padding-left:15px;">
								បណ្ណសន្យារ៉ាប់រងនេះ ស្ថិតក្រោមលក្ខខណ្ឌ លក្ខន្តិកៈ និងការដកស្រង់ដែលអាចអនុវត្តបានទាំងអស់ ការគ្រប់គ្រងការខាតបង់ដែលអាចរកឃើញនូវការខូចខាតរូបវន្ត ឬការខូចខាតរូបវន្តដែលកើតឡើងក្នុងអំឡុងពេលធានារ៉ាប់រង។ ដូច្នេះ និងដោយមិនគិតដល់បទប្បញ្ញត្តិផ្សេងទៀតនៃបណ្ណសន្យារ៉ាប់រងនេះដែលផ្ទុយគ្នា បណ្ណសន្យារ៉ាប់រងនេះមិនធានារ៉ាប់រងការខាតបង់ ការខូចខាត ទំនួលខុសត្រូវ ការទាមទារ ការចំណាយ ឬការចំណាយណាមួយ ដែលបណ្តាលដោយផ្ទាល់ ឬដោយប្រយោល ដោយកើតចេញពី ដោយបណ្តាលមកពី ដោយចូលរួម ឬក្នុងទំនាក់ទំនងជាមួយ (ដោយមិនគិតថាកើតឡើងក្នុងពេលណាមួយ ឬជាលំដាប់ណា) ជំងឺឆ្លង ឬការខ្លាច ឬការគំរាម (មិនថាជាការពិត ឬការយល់ឃើញ) នៃជំងឺឆ្លង។
							</td>

						</table>

						<table>

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								សម្រាប់គោលបំណងនៃបណ្តាំនេះ ការខាតបង់ ការខូចខាត ទំនួលខុសត្រូវ ការទាមទារ ការចំណាយ ឬការចំណាយណាមួយ រួមទាំង ប៉ុន្តែមិនកំណត់ចំពោះ ការចំណាយណាមួយដើម្បីសម្អាត ជម្លៀស ដក ត្រួតពិនិត្យ ឬធ្វើតេស្ត:
							</td>

						</table>

						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.1 </td>
								<td style="text-align: justify; padding-left:15px;">
									ជំងឺឆ្លង ឬ
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.2 </td>
								<td style="text-align: justify; padding-left:15px;">
									ទ្រព្យសម្បត្តិណាមួយដែលធានារ៉ាប់រងនៅទីនេះដែលរងឥទ្ធិពលដោយជំងឺឆ្លងបែបនោះ។
								</td>
							</tr>
						</table>

						<table>

							<td style="vertical-align: top; text-align: left;" >3 </td>
							<td style="text-align: justify; padding-left:15px;">
								ដូចប្រើប្រាស់នៅទីនេះ ជំងឺឆ្លង មានន័យថា ជំងឺណាមួយដែលអាចឆ្លងតាមមធ្យោបាយ ឬភ្នាក់ងារណាមួយពីរូបរាងមួយទៅរូបរាងមួយទៀត:
							</td>

						</table>
						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.1 </td>
								<td style="text-align: justify; padding-left:15px;">
									សារធាតុ ឬភ្នាក់ងាររួមទាំង ប៉ុន្តែមិនកំណត់ចំពោះ មេរោគ បាក់តេរី ប៉ារ៉ាស៊ីត ឬរូបរាងផ្សេងទៀត ឬការផ្លាស់ប្ដូររបស់វា មិនថាជារស់ ឬមិនជារស់ ហើយ
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.2 </td>
								<td style="text-align: justify; padding-left:15px;">
									វិធីឆ្លង មិនថាផ្ទាល់ ឬដោយប្រយោល រួមទាំង ប៉ុន្តែមិនកំណត់ចំពោះ ការឆ្លងតាមខ្យល់ ការឆ្លងតាមរាវរបស់រូបកាយ ការឆ្លងពី ឬទៅផ្ទៃ ឬវត្ថុ ដែរ រាវ ឬឧស្ម័ន ឬរវាងរូបរាង ហើយ
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >3.3 </td>
								<td style="text-align: justify; padding-left:15px;">
									ជំងឺ សារធាតុ ឬភ្នាក់ងារអាចបណ្តាល ឬគំរាមកំហែងនូវការខូចខាតដល់សុខភាពមនុស្ស ឬសុខុមាលភាពមនុស្ស ឬអាចបណ្តាល ឬគំរាមកំហែងនូវការខូចខាត ការខ្សោយ ការបាត់បង់តម្លៃ ភាពអាចលក់បាន ឬការបាត់បង់ការប្រើប្រាស់ទ្រព្យសម្បត្តិដែលធានារ៉ាប់រងនៅទីនេះ។
								</td>
							</tr>
						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >4. </td>
							<td style="text-align: justify;padding-left:15px;">
								បណ្តាំនេះអនុវត្តចំពោះការពង្រីកការគ្រប់គ្រង ការគ្រប់គ្រងបន្ថែម ករណីលើកលែងចំពោះការដកស្រង់ណាមួយ និងការផ្ដល់ការគ្រប់គ្រងផ្សេង។
							</td>

						</table>
						<p style="padding-left:35px;">លក្ខខណ្ឌ លក្ខន្តិកៈ និងការដកស្រង់ផ្សេងទៀតទាំងអស់នៃបណ្ណសន្យារ៉ាប់រងនៅដដែល។</p>

						<p style="text-align: left; margin-top: 20px;">ខកចំណាំការដាក់កំហិត និងការដកស្រង់ការដាក់ទណ្ឌកម្ម</p>
						<p>e-Policy នេះនឹងមិនផ្ដល់ការការពារ ហើយក្រុមហ៊ុននឹងមិនទទួលខុសត្រូវក្នុងការបង់ការទាមទារណាមួយ ឬផ្ដល់អត្ថប្រយោជន៍ណាមួយក្នុងទម្រង់ណាក្នុងករណីដែលការផ្ដល់ការការពារ ការបង់ការទាមទារ ឬការផ្ដល់អត្ថប្រយោជន៍នោះនឹងបញ្ជូនក្រុមហ៊ុនទៅ ការដាក់ទណ្ឌកម្ម ការហាមឃាត់ ឬការដាក់កំហិតណាមួយក្រោម CISAD Act ឬដំណោះស្រាយសហប្រជាជាតិ ឬ ពាណិជ្ជកម្ម ឬ ទណ្ឌកម្មសេដ្ឋកិច្ច ច្បាប់ ឬបទប្បញ្ញត្តិរបស់សហភាពអឺរ៉ុប ចក្រភពអង់គ្លេស។</p>

						<p style="text-align: left; margin-top: 20px;">ដែនកំណត់ទំនួលខុសត្រូវ</p>
						<p>1. យើងខ្ញុំនឹងមិនទទួលខុសត្រូវ:</p>
						<table style="width:100%; padding-left:30px;">
							<tr>
								<td>ក)</td>
								<td style="text-align: justify;padding-left:5px;">
									ក្រោមករណីធានារ៉ាប់រងទី 5 ចំពោះ USD50.00 ដំបូង។
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;">ខ)</td>
								<td style="text-align: justify;padding-left:5px;">
									ក្រោមករណីធានារ៉ាប់រង 7, 8 និង 9 ចំពោះ មួយ (1) ភាគរយដំបូងនៃចំនួនទឹកប្រាក់ធានារ៉ាប់រងសរុបលើអគារ ឬ USD200.00 ណាដែលតិចជាង
								</td>
							</tr>
						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								ដែនកំណត់នៃចំនួនទំនួលខុសត្រូវរបស់យើងខ្ញុំក្រោមអត្ថប្រយោជន៍បន្ថែម ខ) ការសំណងសម្រាប់ការស្លាប់: USD10,000.00 ឬ ពាក់កណ្ដាលនៃចំនួនទឹកប្រាក់ធានារ៉ាប់រងសរុបលើមាតិកា ណាដែលតិចជាង។
							</td>

						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >3. </td>
							<td style="text-align: justify;padding-left:15px;">
								ដែនកំណត់នៃចំនួនទំនួលខុសត្រូវរបស់យើងខ្ញុំក្រោមអត្ថប្រយោជន៍បន្ថែម ហ) ទំនួលខុសត្រូវចំពោះសាធារណៈ: USD50,000.00 ក្នុងគ្រោះថ្នាក់ណាមួយ ឬ ស៊េរីនៃគ្រោះថ្នាក់ ដែលបង្កើតជាការកើតឡើងមួយ ទាក់ទងនឹងអគារ និងមាតិកា។
							</td>

						</table>
						<table style="width:100%;">

							<td style="width:25px;" >4. </td>
							<td style="text-align: justify;">
								តំបន់ភូមិសាស្ត្រ: កម្ពុជា
							</td>

						</table>

						<p style="text-align: left; margin-top: 20px;">ព័ត៌មានការធានារ៉ាប់រង</p>
						<p>
							<u>តើការបញ្ជាក់ណាមួយខាងក្រោមអនុវត្តចំពោះលោក/លោកស្រីទេ?</u>
						</p>
						<table style="width:100%;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >1. </td>
								<td style="text-align: justify;padding-left:15px;">
									ខ្ញុំបានដាក់ការទាមទារ ឬជួបប្រទះការខាតបង់ក្នុងរយៈពេលពីរឆ្នាំកន្លងមកនៅលើអចលនទ្រព្យនេះ ឬអចលនទ្រព្យផ្សេងទៀត។
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">ទេ</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2. </td>
								<td style="text-align: justify;padding-left:15px;">
									លំនៅឋាននឹងត្រូវទុកមិនមានអ្នករស់នៅលើសពី 90 ថ្ងៃ។
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">ទេ</td>
							</tr>

							<xsl:choose>
								<xsl:when test="root/P_StampDuty = 'true'">
									<tr>
										<td></td>
										<td style="text-align: justify;padding-left:15px; padding-top:15px;">បណ្ណសន្យារ៉ាប់រងនេះ មានសិទ្ធិទទួលការលើកលែងពន្ធត្រា។</td>
									</tr>
								</xsl:when>
							</xsl:choose>

						</table>


					</div>
				</div>
				<div style="page-break-after: always"></div>
				<!--6th page-->
				<div style="height:165px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img
						height="115px"
				  style="float:right;padding-right:12px;"
          >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibEnHeader"/>
						</xsl:attribute>
					</img>
				</div>
				<div
				  style="
        padding-left: 30px;
        padding-right: 30px;
        text-align: justify;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.1499023;
      "
    >

					<div style="border: 1px solid black; padding: 10px;">
						<p style="text-align: left; margin-bottom: 20px;">កាតព្វកិច្ចរបស់លោក/លោកស្រីក្នុងការជូនដំណឹងដល់យើងខ្ញុំ</p>
						<p>
							ក្នុងករណីដែលលោក/លោកស្រីបានដាក់ពាក្យស្នើសុំធានារ៉ាប់រងនេះសម្រាប់គោលបំណងដែលមិនទាក់ទងនឹងការធ្វើពាណិជ្ជកម្ម អាជីវកម្ម ឬវិជ្ជាជីវៈរបស់លោក/លោកស្រីទាំងស្រុង លោក/លោកស្រីមានកាតព្វកិច្ចក្នុងការប្រយ័ត្នប្រយែងដើម្បីមិនធ្វើការបំភ្លៃក្នុងការឆ្លើយសំណួរក្នុងពាក្យស្នើសុំ (ឬក្នុងពេលដែលលោក/លោកស្រីបានដាក់ពាក្យស្នើសុំធានារ៉ាប់រងនេះ) ពោលគឺ លោក/លោកស្រីគួរតែឆ្លើយសំណួរទាំងអស់ ដោយពេញលេញ និងត្រឹមត្រូវ។ ការបរាជ័យក្នុងការប្រយ័ត្នប្រយែងក្នុងការឆ្លើយសំណួរអាចបណ្ដាលឱ្យ ការបញ្ចប់កិច្ចសន្យាធានារ៉ាប់រង ការបដិសេធ ឬការកាត់បន្ថយការទាមទាររបស់លោក/លោកស្រី ការផ្លាស់ប្ដូរលក្ខខណ្ឌ ឬការបញ្ចប់កិច្ចសន្យាធានារ៉ាប់រង ស្របតាមដំណោះស្រាយក្នុងកាលវិភាគ 9 នៃ Financial Services Act 2013 ។ លោក/លោកស្រីក៏ត្រូវការបង្ហាញបញ្ហាផ្សេងទៀតដែលលោក/លោកស្រីដឹងថាពាក់ព័ន្ធនឹងការសម្រេចចិត្តរបស់យើងខ្ញុំក្នុងការទទួលហានិភ័យ និងការកំណត់អត្រា និងលក្ខខណ្ឌដែលត្រូវអនុវត្ត។
						</p>

						<p>
							លោក/លោកស្រីក៏មានកាតព្វកិច្ចជូនដំណឹងដល់យើងខ្ញុំភ្លាមៗ ប្រសិនបើនៅពេលណាមួយបន្ទាប់ពីកិច្ចសន្យាធានារ៉ាប់រងរបស់លោក/លោកស្រីត្រូវបានបញ្ចប់ ផ្លាស់ប្ដូរ ឬបន្ត ជាមួយយើងខ្ញុំ ព័ត៌មានណាមួយដែលបានផ្ដល់ក្នុងពាក្យស្នើសុំ (ឬក្នុងពេលដែលលោក/លោកស្រីបានដាក់ពាក្យស្នើសុំធានារ៉ាប់រងនេះ) ខុស ឬបានផ្លាស់ប្ដូរ។
						</p>

						<p style="text-align: left; margin-top: 20px;">ការផ្លាស់ប្ដូរក្នុងការយកពន្ធ បទប្បញ្ញត្តិ និងច្បាប់</p>
						<p>
							យើងខ្ញុំអាចផ្លាស់ប្ដូរលក្ខខណ្ឌនៃបណ្ណសន្យារ៉ាប់រងនេះ ប្រសិនបើមានការផ្លាស់ប្ដូរក្នុងការយកពន្ធ បទប្បញ្ញត្តិ ឬច្បាប់ដែលប៉ះពាល់ដល់បណ្ណសន្យារ៉ាប់រងនេះ។ យើងខ្ញុំនឹងជូនដំណឹងដល់លោក/លោកស្រីជាលាយលក្ខណ៍អក្សរ នៅពេលដែលលក្ខខណ្ឌក្នុងបណ្ណសន្យារ៉ាប់រងនេះ ត្រូវការផ្លាស់ប្ដូរ។
						</p>
						<xsl:choose>
							<xsl:when test="root/P_IsLppsa = 'true'">
								<p>
									ប្រសិនបើពន្ធណាមួយបែបនោះអនុវត្ត វាជាកាតព្វកិច្ចរបស់លោក/លោកស្រីក្នុងការបង់ពន្ធដែលអាចគិតបានបែបនោះ (ទីជាអ្នកអនុវត្ត)។
								</p>
								<p style="padding-bottom: 30px">
									ក្នុងករណីដែលលោក/លោកស្រីមិនបង់ពន្ធបន្ថែមមូលដ្ឋាន ពន្ធលើទំនិញ និងសេវា ឬពន្ធផ្សេងទៀតណាដែលមានលក្ខណៈស្រដៀងគ្នា យើងខ្ញុំអាច ប៉ុន្តែមិនមានកាតព្វកិច្ច ក្នុងការបង់ពន្ធបែបនោះក្នុងនាមលោក/លោកស្រី ហើយលោក/លោកស្រីត្រូវសងទៅ ឬធ្វើការសំណងដល់យើងខ្ញុំចំពោះ ពន្ធបែបនោះទាំងអស់ ស្របតាមការស្នើសុំរបស់យើងខ្ញុំ។
								</p>
							</xsl:when>
							<xsl:otherwise>
								<p style="padding-bottom:100px;"></p>
							</xsl:otherwise>
						</xsl:choose>

					</div>

					<div>
						<table style="width:100%; padding-top:20px;">
							<tr>
								<td style="width:20%;">កាលបរិច្ឆេទចេញ</td>
								<td style="width:5%;">:</td>
								<td style="width:40%;">
									<xsl:value-of select="root/P_Date" />
								</td>
								<td style="width:35%; text-align:right;">ក្នុងនាម</td>
							</tr>
							<tr>
								<td style="width:20%;">ចេញដោយ</td>
								<td style="width:5%;">:</td>
								<td style="width:40%; text-align:justify;">
									<xsl:value-of select="root/P_AgentCode" />
								</td>
								<td style="width:35%; text-align:right;">Etiqa General Insurance Berhad</td>
							</tr>
							<tr>
								<td colspan="4" style="height:70px;">កាលវិភាគបណ្ណសន្យារ៉ាប់រងនេះជាឯកសារដែលបានបង្កើតដោយកុំព្យូទ័រ ហើយមិនចាំបាច់ការចុះហត្ថលេខា</td>
							</tr>
						</table>
					</div>

				</div>

				<div style="page-break-after: always"></div>

				<div style="height:120px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img
						height="115px"
				  style="float:right;padding-right:12px;"
          >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibEnHeader"/>
						</xsl:attribute>
					</img>
				</div>
				<div
				  style="
            padding-left: 30px;
            padding-right: 30px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<div style="border: 1px solid black; height: 1050px">
						<p
						  style="
      font-size: 20px;
      border-bottom: 1px solid black;
      margin-block-start: 0px;
      padding: 6px;
      background-color: #ffc000;
      margin-block-end:5px;
	  text-align:center;
	  text-align:center;
	  padding-bottom: 15px;
	  padding-top: 15px;
    "
  >
							ប័ណ្ណព្រមព្រៀងច្បាប់ការពារទិន្នន័យផ្ទាល់ខ្លួន សម្រាប់អតិថិជនបុគ្គល
						</p>
						<table style= "width:100%;">
							<tr style="height:40px;">
								<td style="width:30%;">ឈ្មោះ:</td>
								<td style="width:5%;">:</td>
								<td style="width:65%; text-align:justify;">
									<xsl:value-of select="root/P_Name" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">លេខអត្តសញ្ញាណប័ណ្ណ</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Nric" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">លេខបណ្ណសន្យារ៉ាប់រង</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">ប្រភេទបណ្ណសន្យារ៉ាប់រង</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">ធានារ៉ាប់រងទូទៅ</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">កាលបរិច្ឆេទ</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Date" />
								</td>
							</tr>
						</table>
						<div style="font-size:16px;  font-family: Arial, Helvetica, sans-serif;text-align: justify; margin:10px;">
							<p>
								ខ្ញុំ យល់ព្រម ព្រមព្រៀង និងអនុញ្ញាតឱ្យ Etiqa General Insurance Berhad (តទៅហៅថា "Etiqa General Insurance") ដំណើរការ ទិន្នន័យផ្ទាល់ខ្លួនរបស់ខ្ញុំ/យើង (រួមទាំងទិន្នន័យផ្ទាល់ខ្លួនដែលប្រកបដោយភាពរសើប) ("ទិន្នន័យផ្ទាល់ខ្លួន") ដោយមានបំណងក្នុងការចូលទៅក្នុងកិច្ចសន្យាធានារ៉ាប់រង ស្របតាមបទប្បញ្ញត្តិនៃ Personal Data Protection Act 2010 ។
							</p>
							<p>
								ខ្ញុំ យល់ ហើយយល់ព្រមថា ទិន្នន័យផ្ទាល់ខ្លួនណាមួយដែលប្រមូល ឬកាន់កាប់ដោយ Etiqa General Insurance (មិនថាមាននៅក្នុងពាក្យស្នើសុំ ឬទទួលបានបើមិនដូច្នោះ) អាចត្រូវបានកាន់កាប់ ប្រើប្រាស់ ដំណើរការ និងបង្ហើបដោយ Etiqa General Insurance ដល់ បុគ្គល និង/ឬ អង្គការ ដែលទាក់ទងនឹង និងទំនាក់ទំនងជាមួយ Etiqa General Insurance ឬភាគីទីបីដែលបានជ្រើសរើស (នៅក្នុង ឬ ក្រៅប្រទេសកម្ពុជា រួមទាំង ស្ថានមន្ទីរពេទ្យ អ្នកធានារ៉ាប់រងឡើងវិញ អ្នកកែតម្រូវ/អ្នកស៊ើបអង្កេត ការទាមទារ ទីភ្នាក់ងារ ក្រុមហ៊ុននីតិកម្ម ក្រុមប្រឹក្សាឧស្សាហកម្ម អ្នកគ្រប់គ្រង ស្ថាប័នច្បាប់ និង ស្ថាប័នរដ្ឋាភិបាល) ដើម្បីជាគោលបំណងក្នុងការដំណើរការពាក្យស្នើសុំ និងផ្ដល់សេវាកម្មជាបន្តបន្ទាប់ ដែលទាក់ទង ហើយដើម្បីទំនាក់ទំនងជាមួយខ្ញុំ/យើងសម្រាប់គោលបំណងបែបនោះ។
							</p>
							<p>
								ខ្ញុំ យល់ថា ខ្ញុំ/យើងមានសិទ្ធិទទួលបានចំណេះដឹង និងស្នើសុំការកែតម្រូវ ទិន្នន័យផ្ទាល់ខ្លួន ណាមួយ ដែលកាន់កាប់ដោយ Etiqa General Insurance ទាក់ទងជាមួយ ខ្ញុំ/យើង។ ការស្នើសុំបែបនោះ អាចធ្វើបានតាមការបំពេញ ទម្រង់ស្នើសុំការចូលប្រើ ដែលអាចរកបាននៅ គេហទំព័រ Etiqa, សាខា Etiqa Insurance ទាំងអស់ ឬទំនាក់ទំនង Etiqa General Insurance តាមអ៊ីម៉ែល PDPA@etiqa.com.my ។ ស្របតាម បទប្បញ្ញត្តិ Personal Data Protection Act 2010 ខ្ញុំ អាចទំនាក់ទំនង មជ្ឈមណ្ឌលសេវាកម្មអតិថិជន នៅ Etiqa Online 1 300 13 8888 ដើម្បីទទួលបានព័ត៌មានលម្អិតនៃ ទិន្នន័យផ្ទាល់ខ្លួន របស់ខ្ញុំ/យើង។ ព័ត៌មានបែបនោះ នឹងត្រូវបានផ្ដល់ជូន បន្ទាប់ពីការផ្ទៀងផ្ទាត់ប៉ុណ្ណោះ។
							</p>
							<p>
								ខ្ញុំ យល់ព្រម ព្រមព្រៀង និងអនុញ្ញាតឱ្យ Etiqa General Insurance ចែករំលែក ទិន្នន័យផ្ទាល់ខ្លួន របស់ខ្ញុំ/យើងជាមួយ Maybank Group, ភ្នាក់ងារ Etiqa Insurance ឬដៃគូសកល និងភាគីទីបីផ្សេងទៀត ("អង្គការផ្សេងទៀត") ដូចដែល Etiqa General Insurance យល់ឃើញ ហើយ ខ្ញុំ/យើង អាចទទួលបាន ការទំនាក់ទំនងទីផ្សារ ពី Etiqa General Insurance ឬ ពី អង្គការផ្សេងទៀតទាំងនេះ អំពីផលិតផល និងសេវាកម្ម ដែលអាចទាក់ទាញ ខ្ញុំ/យើង ។
							</p>
							<div>
								<table style="width: 100%; padding-top: 15px; padding-bottom: 15px;">
									<tr>
										<xsl:choose>
											<xsl:when test="root/P_Checked = 'false'">
												<div style="display:flex;">
													<td style="width: 50%;padding-bottom:35px;padding-left:300px">

														<img height="66px" >
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageUnchecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">បាទ/ចាស</p>

													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:30px;padding-bottom:35px;">

														<img height="70px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageChecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:90px;margin-top:-42px">ទេ</p>

													</td>
												</div>
											</xsl:when>
											<xsl:when test="root/P_Checked = 'true'">
												<div style="display:flex;">
													<td style="width: 50%;padding-bottom:35px;padding-left:300px">
														<img height="70px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageChecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">បាទ/ចាស</p>
													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:40px;padding-bottom:35px;">
														<img height="66px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageUnchecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:70px;margin-top:-42px">ទេ</p>
													</td>
												</div>
											</xsl:when>
										</xsl:choose>
									</tr>
								</table>
							</div>

							<p>
								ចំណាំ: ប្រសិនបើ លោក/លោកស្រី លែងចង់ទទួលការទំនាក់ទំនងទីផ្សារ សូមជូនដំណឹងដល់ Etiqa General Insurance ដើម្បីដកការព្រមព្រៀង ហើយ Etiqa General Insurance នឹងបញ្ឈប់ ការដំណើរការ និងការចែករំលែក ទិន្នន័យផ្ទាល់ខ្លួន របស់លោក/លោកស្រី ជាមួយ អង្គការផ្សេងទៀតទាំងនេះ ដើម្បីជាគោលបំណង ក្នុងការផ្ញើ ការទំនាក់ទំនងទីផ្សារ ។ ដើម្បីជៀសវាង ការមិនប្រាកដ ការដក ប្រយោជន៍ មិនរាប់បញ្ចូល ការដំណើរការ ទិន្នន័យផ្ទាល់ខ្លួន ដែលចាំបាច់ ។
							</p>
							<p style="font-size:18px; padding-top: 50px; padding-bottom: 30px;">
								នេះជាឯកសារដែលបានបង្កើតដោយកុំព្យូទ័រ ហើយ មិនតម្រូវការ ចុះហត្ថលេខា
							</p>
						</div>

					</div>
				</div>
				<table>
					<tr style="height:90px"></tr>
				</table>
				<div style="margin-top:80px;bottom: 0; margin-left:5px; margin-right:5px;">
					<img
						  height="70px;"
					width="100%;"
            >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibEnFooter"/>
						</xsl:attribute>
					</img>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
