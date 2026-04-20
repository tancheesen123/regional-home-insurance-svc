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
								<xsl:value-of select="root/ImageEgibBmHeader"/>
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
							Tarikh :
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
								TERIMA KASIH KERANA MEMILIH ETIQA. SUKACITANYA KAMI MEMAKLUMKAN
								BAHAWA PERLINDUNGAN ANDA TELAH DIAKTIFKAN
							</u>
						</p>
						<table style="width:100%;text-align:justify">
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">No. Polisi</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center;text-align:left;">Nama Pelan</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<!--<xsl:value-of select="root/P_PlanName" />-->
									<xsl:value-of select="root/P_CoverTypeName" />
								</td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:center; text-align:left;">Tempoh Insuran</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;">
									<xsl:value-of select="root/P_PeriodofInsurance" />
								</td>
							</tr>
						</table>
						<hr style="border-style: solid" />
						<p style="font-size: 16px; margin-block-end: 20px">
							Kami sertakan dokumen berikut untuk tindakan anda yang selanjutnya:-
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							Jadual Polisi
						</p>

						<p style="font-size: 16px; margin-block-end: 20px">
							Dokumen penting ini adalah rumusan bagi maklumat-maklumat polisi anda dan hendaklah disimpan sebagai rujukan.
							Harap maklum bahawa maklumat-maklumat yang terdapat dalam jadual polisi ini adalah berdasarkan maklumat yang
							telah anda isytiharkan kepada kami sewaktu permohonan. Anda dinasihatkan untuk memeriksa dokumen ini dengan
							teliti dan sekiranya terdapat sebarang percanggahan, sila maklumkan kepada kami dengan segera.

						</p>
						<p style="font-size: 16px; margin-block-end: 20px">
							Untuk sebarang pertanyaan mengenai perihal yang di atas atau berkenaan produk-produk kami yang lain, sila hubungi
							Etiqa Oneline di talian 1 300 13 8888 atau emelkan kepada kami di alamat info@etiqa.com.my. Untuk sebarang urusan
							tuntutan, anda boleh menghubungi Claims Careline kami di talian 1 300 88 1007 bagi perkhidmatan tuntutan yang
							cepat dan efisyen. Kami sekali lagi mengucapkan selamat datang ke Etiqa.

						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							Yang Benar.
						</p>
						<p style="font-size: 16px; margin-block-start:30px">
							Etiqa General Insurance Berhad
						</p>

						<p style="font-size:16px; margin-block-start:30px">
							Manfaat-manfaat yang dibayar di bawah polisi yang layak adalah dilindungi oleh PIDM sehingga had perlindungan. Sila rujuk <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my/en/how-we-protect-you/tips/information-materials/brochures">
								<i>
									Brosur Sistem
									Perlindungan Manfaat Takaful dan Insurans PIDM
								</i>
							</a> atau hubungi Etiqa General Insurance Berhad atau PIDM (layari <a style="cursor: pointer; text-decoration:none;" href="https://www.pidm.gov.my">www.pidm.gov.my</a>).
						</p>
						<br/>
						<br/>
						<p>
							Tarikh Dikeluarkan : <xsl:value-of select="root/P_Date"/><br/>
							Oleh : <xsl:value-of select="root/P_AgentCode"/>
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
							<xsl:value-of select="root/ImageEgibBmHeader"/>
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
								JADUAL
							</p>
						</div>
						<div style="flex: 1;padding-top: 0px;">
							<p style="margin-block-start: 10px;font-size: 18px;text-align:right;font-family: Arial, Helvetica, sans-serif; border: 2px solid black; padding: 5px; margin-left:250px;">
								SETEM DUTI BERBAYAR
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
									<td style="width:35%">Nombor Polisi</td>
									<td style="width:3%">:</td>
									<td style="width:62%">
										<xsl:value-of select="root/P_PolicyNo" />
									</td>
								</tr>
								<tr>
									<td>Nombor Akaun</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_AgentCode" />
									</td>
								</tr>
								<tr>
									<td>Jenis Perlindungan</td>
									<td>:</td>
									<td>
										<xsl:value-of select="root/P_CoverTypeName" />
									</td>
								</tr>
								<tr>
									<td colspan="3">
										<p style="text-align: justify; padding-top:5px;">
											Dari <xsl:value-of select="root/P_StartDate" /> Hingga <xsl:value-of select="root/P_EndDate" /> (termasuk kedua-dua tarikh)
											Sebarang tempoh selanjutnya di mana Anda hendaklah membayar dan
											Syarikat mungkin bersetuju untuk menerima premium pembaharuan.
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
								<td style="width:45%;">Jumlah Perlindungan</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_TotalSumInsured" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Premium Asas</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_AnnualPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Manfaat Tambahan:</td>
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
									<td style="width:20%; text-align: right;">RM</td>
									<td style="width:30%; text-align: right;">
										<xsl:value-of select="Price" />
									</td>
								</tr>
							</xsl:for-each>
							<!-- <tr style="height: 30px;">
                <td style="width:45%;">Riot, Strike and Malicious Damage</td>
                <td style="width:5%">:</td>
                <td style="width:20%; text-align: right;">RM</td>
                <td style="width:30%; text-align: right;">xxxx.xx</td>
            </tr> -->
							<tr style="height: 30px;">
								<td style="width:45%;">Jumlah Premium Kasar</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremium" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									Diskaun (<xsl:value-of select="root/P_DiscountRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">(-) RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Discount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Premium Kasar Selepas Diskaun</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_GrossPremiumAfterDiscount" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">
									Cukai Perkhidmatan (<xsl:value-of select="root/P_TaxRate" />%)
								</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_Tax" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Duti Setem</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;">RM</td>
								<td style="width:30%; text-align: right;">
									<xsl:value-of select="root/P_StampDuty" />
								</td>
							</tr>
							<tr style="height: 30px;">
								<td style="width:45%;">Jumlah Premium</td>
								<td style="width:5%">:</td>
								<td style="width:20%; text-align: right;border-top: 2px solid black;">RM</td>
								<td style="width:30%; text-align: right;border-top: 2px solid black;">
									<xsl:value-of select="root/P_Total" />
								</td>
							</tr>
						</table>
					</div>
					<div style="padding-left:5px; border:2px solid black; margin-top:5px;">
						<table style="width:100%; font-size:16px">
							<tr style="height: 40px;">
								<td style="width:45%;">Nombor Risiko</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;">
									<xsl:value-of select="root/P_RiskNo" />
								</td>
							</tr>
							<tr style="height: 40px;">
								<td style="width:45%;">Nombor Rujukan IP</td>
								<td style="width:5%">:</td>
								<td style="width:50%; text-align: left;"></td>
							</tr>
							<tr>
								<td style="width:45%;">Lokasi Kediaman Yang Diinsuranskan</td>
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
							<xsl:value-of select="root/ImageEgibBmHeader" />
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
							<div style="padding-left:5px; border:2px solid black;">
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Klasifikasi Bangunan </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Jenis Bangunan </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Jenis Perlindungan </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Jenis Kadar </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">Tariff Rate</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Kadar (%)  </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingRate" />
										</td>
									</tr>
								</table>

								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Item </td>
										<td style="width:40%" colsapn="2">Butiran Kediaman / Butiran Lindungan </td>

										<td style="width:15%; text-align: right;" colspan="2">Jumlah</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;">1 </td>
										<td style="width:5%">Pada satu unit bangunan</td>
										<td style="width:5%">RM</td>
										<td style="text-align:right;">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">Jumlah:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">RM</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_BuildingSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Akses </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">Nil</td>
									</tr>

								</table>
							</div>
						</xsl:when>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="root/P_isContent = 'true'">
							<!--2nd table-->
							<div style="padding-left:5px;border:2px solid black; margin-top:5px">
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Klasifikasi Bangunan  </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ConstructionClass" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Jenis Bangunan  </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_BuildingType" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Jenis Perlindungan </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_CoverTypeName" />
										</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Jenis Kadar </td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">Tariff Rate</td>
									</tr>
									<tr style="height: 30px;">
										<td style="width:45%;">Kadar (%)</td>
										<td style="width:5%">:</td>
										<td style="width:50%; text-align: left;">
											<xsl:value-of select="root/P_ContentRate" />
										</td>
									</tr>
								</table>

								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Item </td>
										<td style="width:40%" colsapn="2">Butiran Kediaman / Butiran Lindungan </td>

										<td style="width:15%; text-align: right;" colspan="2">Jumlah</td>
									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;">1 </td>
										<td style="width:5%">Pada isi rumah</td>
										<td style="width:5%">RM</td>
										<td style="text-align:right;">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>
									<tr style="height: 40px;">
										<td style="width:45%;"> </td>
										<td style="width:5%; text-align:right; padding-right:30px;">Jumlah:</td>
										<td style="width:5%;border-top: 2px dashed black;border-bottom: 2px dashed black; padding-right:40px;">RM</td>
										<td style="border-top: 2px dashed black;border-bottom: 2px dashed black; text-align:right;" colspan="3">
											<xsl:value-of select="root/P_ContentSumInsured" />
										</td>

									</tr>

								</table>
								<table style="width:100%; font-size:16px; ">
									<tr style="height: 30px;">
										<td style="width:45%;">Akses </td>
										<td style="width:5%" colsapn="2">:</td>

										<td style="width:50%; text-align: left;" colspan="2">Nil</td>
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
										<u>Item</u>
									</td>
									<td style="width:20%;">
										<u>Jenis</u>
									</td>
									<td style="width:40%;">
										<u>Butiran Kediaman / Butiran Lindungan</u>
									</td>
									<td style="width:25%;">
										<u>Nilai Teperinci</u>
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
										<td style="width:25%;">RM</td>
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
											<td style="width:40%; text-align:right; padding-right:20px;">Jumlah:</td>
											<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">RM</td>
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
									<xsl:value-of select="root/ImageEgibBmHeader"/>
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
							<table style="width:100%; padding-top:20px; border:2px solid black;">
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
										<td style="width:25%;">RM</td>
										<td style="width:10%;">
											<xsl:value-of select="Value" />
										</td>
									</tr>
								</xsl:for-each>
								<tr style="height:30px;"></tr>
								<tr style="height:35px;">
									<td style="width:10%;"></td>
									<td style="width:20%;"></td>
									<td style="width:40%; text-align:right; padding-right:20px;">Total:</td>
									<td style="width:25%; border-top:2px dashed black;border-bottom:2px dashed black">RM</td>
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
								<xsl:value-of select="root/ImageEgibBmHeader"/>
							</xsl:attribute>
						</img>
					</div>
					<div style="border: 1px solid black; padding: 10px;">
						<p>
							Tertakluk kepada waranti, Pengendorsan dan Fasal yang berkenaan dan/atau yang dilampirkan secara
							berasingan pada e-polisi ini :
						</p>
						<table style="width: 100%; border-collapse: collapse;">
							<thead>
								<tr>
									<th style="text-align: left; padding: 3px 5px;">Kod</th>
									<th style="text-align: left; padding: 3px 5px;">Nama</th>
									<th style="text-align: left; padding: 3px 5px;">Kadar</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style="padding: 3px 5px;">C008</td>
									<td style="padding: 3px 5px;">PENGECUALIAN TAPAK BANGUNAN</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">C42B</td>
									<td style="padding: 3px 5px;">PENGENALPASTIAN TARIKH</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">C045</td>
									<td style="padding: 3px 5px;">FASAL PENJELASAN KEROSAKAN HARTA</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">W026</td>
									<td style="padding: 3px 5px;">WARANTI SUMBANGAN</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">M002</td>
									<td style="padding: 3px 5px;">INFORMATION ON IMB/CSB (AS PER IMPORTANT NOTICE ATTACHED)</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">C046</td>
									<td style="padding: 3px 5px;">FASAL PENGECUALIAN ASBESTOS (HANYA MELIBATKAN SEKSYEN IIIB SAHAJA)</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">C047</td>
									<td style="padding: 3px 5px;">FASAL PENGECUALIAN RADIOAKTIF/RISIKO TENAGA NUKLEAR</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">W001</td>
									<td style="padding: 3px 5px;">WARANTI PEMBATASAN BARANGAN DAGANGAN</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">C049</td>
									<td style="padding: 3px 5px;">KLAUSA PENGAGIHAN LEBIHAN INSURANS</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">M007</td>
									<td style="padding: 3px 5px;">PENGECUALIAN CYBER DAN DATA</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<tr>
									<td style="padding: 3px 5px;">C051</td>
									<td style="padding: 3px 5px;">PENGESAHAN PENYAKIT MUDAH JANGKIT</td>
									<td style="padding: 3px 5px;"></td>
								</tr>
								<xsl:choose>
									<xsl:when test="root/P_IsRsmdAddOnExist = 'true'">
										<tr>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_RsmdAddOnCode"/>
											</td>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_RsmdAddOnName"/>
											</td>
											<td style="padding: 3px 5px;">
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
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnCode"/>
											</td>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnName"/>
											</td>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_ExtendedTheftAddOnRate"/>%
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsSubsidenceAndLandslideAddOnExist = 'true'">
										<tr>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_SubsidenceAndLandslideAddOnCode"/>
											</td>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_SubsidenceAndLandslideAddOnName"/>
											</td>
											<td style="padding: 3px 5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsDamagesByFailingTreeAddOnExist = 'true'">
										<tr>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_DamagesByFailingTreeAddOnCode"/>
											</td>
											<td style="padding: 3px 5px;">
												<xsl:value-of select="root/P_DamagesByFailingTreeAddOnName"/>
											</td>
											<td style="padding: 3px 5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
							</tbody>
						</table>

						<p style="margin-top: 20px;">PENGECUALIAN CYBER DAN DATA</p>
						<p>
							Meskipun terdapat peruntukan yang bertentangan dalam Polisi ini atau apa jua pengendorsan padanya, Polisi ini
							mengecualikan sebarang:
						</p>
						<p>
							Kerugian Cyber;<br/>
						</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1.2 </td>
							<td style="text-align: justify;">
								Kehilangan, kerosakan, liabiliti, tuntutan, kos, perbelanjaan dalam apa jua bentuk secara langsung atau tidak
								langsung disebabkan oleh, berpunca daripada, akibat daripada, disebabkan dari atau berkaitan dengan
								sebarang kehilangan penggunaan, pengurangan kefungsian, pembaikan, penggantian, pemulihan atau
								penghasilan semula sebarang Data, termasuk apa jua jumlah yang berkaitan dengan nilai Data tersebut; tidak
								kira jika terdapat sebarang sebab lain atau perkara yang menyumbang secara serentak atau sebarang turutan
								lain yang sama padanya.Sekiranya terdapat sebahagian daripada pengendorsan ini didapati tidak sah atau tidak
								boleh dikuatkuasakan, bahagian yang lainya akan kekal berkuat kuasa sepenuhnya.
								Pengendorsan ini akan dikira pakai sekiranya terdapat konflik dengan apa-apa jua perkataan lain di dalam Polisi
								atau pengendorsan lain padanya yang mempunyai kesan ke atas Kerugian Cyber atau Data, dan Pengendorsan
								ini akan menggantikan perkataan tersebut.
							</td>

						</table>




						<p style="margin-top: 20px;">Definisi</p>
						<p>
							Kerugian Cyber bermaksud kehilangan, kerosakan, liabiliti, tuntutan, kos atau perbelanjaan dalam apa jua bentuk
							sama ada secara langsung atau tidak langsung disebabkan oleh, berpunca daripada, akibat daripada, disebabkan
							dari atau berkaitan dengan apa jua Perbuatan/Tindakan Cyber atau Kejadian Cyber termasuk, tetapi tidak terhad
							kepada, tindakan yang diambil untuk mengawal, menghalang, menyekat atau memulihkan sebarang
							Perbuatan/Tindakan Cyber atau Kejadian Cyber.Tindakan Cyber bermaksud tindakan yang tidak dibenarkan, berniat
							jahat atau jenayah atau siri kaitan tindakan yang tidak dibenarkan, berniat jahat atau tindakan jenayah , tidak megira
							masa tau tempat, atau ancaman atau tipu helah sedemikian yang melibatkan akses kepada, pemprosesan,
							penggunaan atau pengendalian sebarang Sistem Komputer.
						</p>

						<p>Kejadian Cyber bermaksud:</p>
						<ol style="margin-left: 10px;">
							<li>
								Kesilapan atau kegagalan atau siri kesilapan atau kegagalan berkaitan yang melibatkan akses kepada,
								pemprosesan, penggunaan atau pengendalian sebarang Sistem Komputer; atau
							</li>
							<li>
								Ketidaksediaan separa atau sepenuhnya atau siri ketidaksediaan separa atau sepenuhnya berkaitan atau
								kegagalan untuk mencapai, memproses, mengguna atau mengendali sebarang Sistem Komputer.
							</li>
						</ol>

						<p>Sistem Komputer bermaksud:</p>
						<p>
							Sebarang komputer, perkakasan, perisian, sistem komunikasi, alat elektronik (termasuk, tetapi tidak terhad kepada,
							telefon pintar, komputer riba, komputer tablet, alat sesuai dipakai), pelayan, pengkomputeran awan atau
							mikropengawal termasuk apa sahaja sistem yang serupa atau konfigurasi yang disebut terdahulu dan termasuk apa
							sahaja input, output, alat penyimpanan data, peralatan perangkaian atau kemudahan sandar berhubung, yang
							dimiliki atau dikendalikan oleh Pemegang Polisi atau mana-mana pihak lain
						</p>

						<p style="padding-bottom:3px;">
							Data bermaksud maklumat, fakta, konsep, kod atau sebarang maklumat lain yang disimpan atau dihantar dalam
							sesuatu bentuk untuk digunakan, dicapai, diproses, dihantar atau disimpan oleh sebuah Sistem Komputer.
						</p>
					</div>

				</div>
				<div style="page-break-after: always"></div>

				<!--5th page-->
				<div style="height:150px">
					<table>
						<tr style="height:0.2px"></tr>
					</table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibBmHeader" />
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
						<p style="text-align: left; margin-bottom: 20px;">PENGESAHAN PENYAKIT MUDAH JANGKIT</p>
						<table>

							<td style="vertical-align: top; text-align: left;" >1. </td>
							<td style="text-align: justify;padding-left:15px;">
								Meskipun terdapat peruntukan yang bertentangan dalam perjanjian insurans ini, perjanjian insurans ini
								mengecualikan semua kerugian yang sebenar atau didakwa, liabiliti, kerosakan, pampasan, kecederaan,
								penyakit, kematian, pembayaran perubatan, kos pertahanan pembelaan, kos, perbelanjaan atau apa-apa jua
								jumlah lain yang ditanggung oleh atau terakru kepada yang Diinsuranskan, secara langsung atau tidak langsung
								dan tidak mengambil kira sebab-sebab lain yang menyumbang serentak atau dalam mana-mana urutan, yang
								berasal daripada, disebabkan oleh, berpunca daripada, disebabkan oleh, yang diakibatkan daripada, atau
								selainnya berkaitan dengan Penyakit Mudah Jangkit atau kebimbangan atau ancaman (sama ada sebenar atau
								dianggap) sesuatu Penyakit Mudah Jangkit.
							</td>

						</table>

						<table>

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								Seperti yang terkandung di dalam ini, Penyakit Berjangkit bermakna sebarang penyakit yang boleh merebak
								melalui sebarang bahan atau agen daripada apa sahaja organisma kepada organisma lain yang mana:
							</td>

						</table>

						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.1 </td>
								<td style="text-align: justify; padding-left:15px;">
									fbahan atau agen tersebut terdiri daripada, tetapi tidak terhad kepada, virus, bakterium, parasit atau
									organisma lain atau ubahannya, sama ada dianggap hidup atau tidak, dan
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.2 </td>
								<td style="text-align: justify; padding-left:15px;">
									cara jangkitan, sama ada langsung atau tidak langsung, termasuk tetapi tidak terhad kepada, cara
									jangkitan bawaan udara, cara jangkitan cecair badan, cara jangkitan daripada atau kepada sebarang
									permukaan atau objek, pejal, cecair atau gas atau antara organisma, dan
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2.3 </td>
								<td style="text-align: justify; padding-left:15px;">
									penyakit, bahan atau agen tersebut boleh menyebabkan atau mengancam kecederaan anggota,
									penyakit, kecemasan emosi atau kerosakan kepada kesihatan manusia, kebajikan manusia atau
									kerosakan harta.Tertakluk selain dinyatakan kepada terma, pengecualian dan syarat-syarat Polisi.
								</td>
							</tr>
						</table>

						<!-- <table>
	
		<td style="vertical-align: top; text-align: left;" >3 </td>
 <td style="text-align: justify; padding-left:15px;">
As used herein, a Communicable Disease means any disease which can be transmitted by means of any substance or agent from any organism to another organism where:
		  </td>
	
		</table>
       	    <table style="padding-left:30px;">
	<tr>
		<td style="vertical-align: top; text-align: left;" >3.1 </td>
 <td style="text-align: justify; padding-left:15px;">
the substance or agent includes, but is not limited to, a virus, bacterium, parasite or other organism or any variation thereof, whether deemed living or not, and
		  </td>
	</tr>
		<tr>
		<td style="vertical-align: top; text-align: left;" >3.2 </td>
 <td style="text-align: justify; padding-left:15px;">
the method of transmission, whether direct or indirect, includes but is not limited to, airborne transmission, bodily fluid transmission, transmission from or to any surface or object, solid, liquid or gas or between organisms, and
		  </td>
	</tr>
			<tr>
		<td style="vertical-align: top; text-align: left;" >3.3 </td>
 <td style="text-align: justify; padding-left:15px;">
the disease, substance or agent can cause or threaten damage to human health or human welfare or can cause or threaten damage to, deterioration of, loss of value of, marketability of or loss of use of property insured hereunder.
		  </td>
	</tr>
		</table>
              	    <table style="width:100%;">
	
		<td style="vertical-align: top; text-align: left;" >4. </td>
 <td style="text-align: justify;padding-left:15px;">
This endorsement applies to all coverage extensions, additional coverages, exceptions to any exclusion and other coverage grant(s).
		  </td>
	
		</table>
        <p style="padding-left:35px;">All other terms, conditions and exclusions of the policy remain the same.</p> -->

						<p style="text-align: left; margin-top: 20px;">HAD SEKATAN DAN FASAL PENGECUALIAN</p>
						<p>
							Polisi insurans ini tidak boleh memberikan perlindungan dan Kami tidak akan bertanggungjawab untuk membayar
							apa-apa tuntutan atau memberikan apa-apa Manfaat di bawah ini di mana peruntukan perlindungan, pembayaran
							tuntutan, atau peruntukan Manfaat tersebut akan mendedahkan Kami kepada mana-mana larangan atau sekatan di
							bawah Resolusi Pertubuhan Bangsa-Bangsa Bersatu atau perdagangan atau sekatan ekonomi, undang-undang atau
							peraturan-peraturan Kesatuan Eropah, United Kingdom atau Amerika Syarikat.
						</p>

						<p style="text-align: left; margin-top: 20px;">HAD LIABILITI</p>
						<p>1. Kami tidak akan bertanggungjawab ke atas:</p>
						<table style="width:100%; padding-left:30px;">
							<tr>
								<td>a)</td>
								<td style="text-align: justify;padding-left:5px;">
									Di bawah item 5 untuk RM50.00 pertama
								</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;">b)</td>
								<td style="text-align: justify;padding-left:5px;">
									Di bawah item 7, 8 dan 9 untuk (1) peratus yang pertama daripada Keseluruhan Jumlah Perlindungan ke atas
									Bangunan atau RM200.00 yang mana lebih rendah.
								</td>
							</tr>
						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >2. </td>
							<td style="text-align: justify;padding-left:15px;">
								Had amaun liabiliti dibawah Manfaat Tambahan C) untuk Kematian: RM10,000.00 atau satu per dua daripada
								Keseluruhan Jumlah Dilindungi ke atas Kandungan mengikut mana yang lebih rendah
							</td>

						</table>
						<table style="width:100%;">

							<td style="vertical-align: top; text-align: left;" >3. </td>
							<td style="text-align: justify;padding-left:15px;">
								Had amaun liabiliti dibawah Manfaat Tambahan F) Liabiliti Awam: RM50,000.00 mana-mana satu kemalangan
								atau siri kemalangan yang dianggap sebagai satu peristiwa yang berhubung dengan Bangunan dan kandungan
								masing-masing
							</td>

						</table>
						<table style="width:100%;">

							<td style="width:25px;" >4. </td>
							<td style="text-align: justify;">
								Kawasan Geografi: Malaysia
							</td>

						</table>

						<p style="text-align: left; margin-top: 20px;">MAKLUMAT PENGUNDERAITAN</p>
						<p>
							<u>
								Adakah anda tergolong di dalam mana-mana kenyataan yang berikut?
							</u>
						</p>
						<table style="width:100%;">
							<tr>
								<td style="vertical-align: top; text-align: left;" >1. </td>
								<td style="text-align: justify;padding-left:15px;">
									Saya pernah membuat tuntutan atau mengalami kerugian dalam masa dua tahun dengan kediaman ini atau lain-lain
									kediaman
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">Tidak</td>
							</tr>
							<tr>
								<td style="vertical-align: top; text-align: left;" >2. </td>
								<td style="text-align: justify;padding-left:15px;">
									Kediaman ini akan ditinggalkan tanpa sebarang penghuni untuk lebih daripada 90 hari
								</td>
							</tr>
							<tr>
								<td></td>
								<td style="text-align: justify;padding-left:15px;">Tidak</td>
							</tr>
							<xsl:choose>
								<xsl:when test="root/P_StampDuty = 'true'">
									<tr>
										<td></td>
										<td style="text-align: justify;padding-left:15px; padding-top:15px;">Polisi ini layak untuk pengecualian setem duti.</td>
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
							<xsl:value-of select="root/ImageEgibBmHeader"/>
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
						<p style="text-align: left; margin-bottom: 20px;">KEPENTINGAN PENDEDAHAN</p>
						<p>
							Menurut Perenggan 5 daripada Jadual 9 Akta Perkhidmatan Kewangan 2013, jika anda memohon insurans ini
							sepenuhnya untuk tujuan yang tidak berkaitan perdagangan, perniagaan atau profesion anda, anda mempunyai
							kewajipan untuk mengambil langkah yang munasabah untuk tidak salah nyata dalam menjawab soalan-soalan di
							dalam Borang Cadangan (atau semasa memohon insurans ini). Anda dikehendaki menjawab soalan-soalan dalam
							Borang Cadangan ini dengan lengkap dan tepat.
						</p>

						<p>
							Anda juga mempunyai kewajipan untuk memberitahu kami dengan serta-merta jika pada bila-bila masa selepas
							kontrak insurans anda ditandatangani, diubah atau diperbaharui dengan kami (atau semasa permohonan insurans
							ini), apa-apa maklumat yang dinyatakan dalam Borang Cadangan tidak tepat atau sudah berubah.
						</p>

						<p style="text-align: left; margin-top: 20px;">
							PERUBAHAN DALAM PERCUKAIAN, PERATURAN DAN PERUNDANGAN
						</p>
						<p style="padding-bottom:100px;">
							Kami boleh mengubah terma-terma dalam Polisi ini jika terdapat perubahan dalam percukaian, peraturan atau
							perundangan yang menjejaskan Polisi ini. Kami akan memaklumkan Anda secara bertulis apabila terma-terma
							dalam Polisi ini perlu diubah.
						</p>

					</div>

					<div>
						<table style="width:100%; padding-top:20px;">
							<tr>
								<td style="width:20%;">Tarikh Dikeluarkan</td>
								<td style="width:5%;">:</td>
								<td style="width:40%;">
									<xsl:value-of select="root/P_Date" />
								</td>
								<td style="width:35%; text-align:right;">Untuk dan bagi pihak,</td>
							</tr>
							<tr>
								<td style="width:20%;">Oleh</td>
								<td style="width:5%;">:</td>
								<td style="width:40%; text-align:justify;">
									<xsl:value-of select="root/P_AgentCode" />
								</td>
								<td style="width:35%; text-align:right;">Etiqa General Insurance Berhad</td>
							</tr>
							<tr>
								<td colspan="4" style="height:70px;">Jadual Polisi ini adalah dokumen yang dijana komputer. Oleh itu, tiada tandatangan diperlukan</td>
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
							<xsl:value-of select="root/ImageEgibBmHeader"/>
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
							Slip Akta Perlindungan Data Peribadi bagi Pelanggan Individu
						</p>
						<table style= "width:100%;">
							<tr style="height:40px;">
								<td style="width:30%;">Nama:</td>
								<td style="width:5%;">:</td>
								<td style="width:65%; text-align:justify;">
									<xsl:value-of select="root/P_Name" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">No Kad Pengenalan</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Nric" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">No Polisi</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_PolicyNo" />
								</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Jenis Polisi</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">Insurance Am</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Tarikh</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">
									<xsl:value-of select="root/P_Date" />
								</td>
							</tr>
						</table>
						<div style="font-size:16px;  font-family: Arial, Helvetica, sans-serif;text-align: justify; margin:10px;">
							<p>
								Saya bersetuju untuk membenarkan Etiqa General Insurance Berhad untuk memproses data peribadi saya, termasuk
								data peribadi sensitif, bagi tujuan mengikat kontrak Insurans, dengan mematuhi peruntukan Akta Perlindungan Data
								Peribadi 2010.

							</p>
							<p>
								Saya memahami dan bersetuju bahawa mana-mana data peribadi yang dikumpul atau dimiliki oleh Etiqa General
								Insurance, sama ada terkandung dalam permohonan ini atau diperolehi selepasnya, boleh dimiliki, diguna, diproses
								dan didedahkan oleh Etiqa General Insurance kepada individu atau organisasi yang berkaitan dan mempunyai
								hubungan dengan Etiqa General Insurance atau mana-mana pihak ketiga yang terpilih (dalam atau luar Malaysia,
								termasuk institusi perubatan, syarikat reinsurans, adjuster tuntutan, penyiasat tuntutan, peguam, persatuan industri,
								pengawal selia, badan-badan berkanun dan pihak berkuasa kerajaan), bagi tujuan memproses permohonan ini,
								menyediakan perkhidmatan secara berterusan yang berkaitan dengannya dan untuk berkomunikasi dengan saya bagi
								tujuan tersebut
							</p>
							<p>
								Saya faham bahawa saya berhak memperoleh akses kepada, dan memohon sebarang pembetulan data peribadi yang
								dipegang oleh Etiqa General Insurance berkaitan dengan saya. Saya faham bahawa permohonan tersebut boleh dibuat
								dengan melengkapkan Borang Permohonan Akses yang boleh didapati di semua cawangan Etiqa Insurance atau
								hubungi Etiqa General Insurance melalui e-mel di PDPA@etiqa.com.my. Saya faham bahawa mengikut peruntukan
								PDPA, saya boleh menghubungi Pusat Khidmat Pelanggan di Etiqa Online di 1300 13 8888 untuk data peribadi saya.
								Maklumat tersebut hanya diberikan selepas pengesahan.
							</p>
							<p>
								Saya bersetuju dan membenarkan Etiqa General Insurance untuk berkongsi Data Peribadi saya dengan Kumpulan
								Maybank, dan pihak ketiga yang terpilih, yang Etiqa General Insurance rasakan patut, dan saya akan menerima
								komunikasi pemasaran dari Etiqa General Insurance atau daripada entiti lain mengenai produk dan perkhidmatan yang
								mungkin menarik kepada saya.
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
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Ya</p>

													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:30px;padding-bottom:35px;">

														<img height="70px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageChecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:90px;margin-top:-42px">Tidak</p>

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
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Ya</p>
													</td>
												</div>
												<div style="display:flex;">
													<td style="width: 50%;padding-left:40px;padding-bottom:35px;">
														<img height="66px">
															<xsl:attribute name="src">
																<xsl:value-of select="root/ImageUnchecked" />
															</xsl:attribute>
														</img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:70px;margin-top:-42px">Tidak</p>
													</td>
												</div>
											</xsl:when>
										</xsl:choose>
									</tr>
								</table>
							</div>

							<p>
								Nota : Sekiranya anda tidak mahu lagi menerima sebarang komunikasi promosi, sila maklumkan kepada pihak Etiqa
								General Insurance bagi tujuan menghentikan data peribadi anda daripada diproses dan dikongsi kepada pihak ketiga.
								Untuk mengelakkan kekeliruan, ini tidak termasuk pemprosesan Data Peribadi yang diwajibkan.
							</p>
							<p style="font-size:18px; padding-top: 50px; padding-bottom: 30px;">
								Ini adalah dokumen cetakan komputer dan tidak memerlukan tandatangan
							</p>
						</div>

					</div>
				</div>
				<table>
					<tr style="height:90px"></tr>
				</table>
				<div style="margin-top:80px;bottom: 0; margin-left:30px; margin-right:30px;">
					<img
						  height="70px;"
					width="100%;"
            >
						<xsl:attribute name="src">
							<xsl:value-of select="root/ImageEgibBmFooter"/>
						</xsl:attribute>
					</img>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
