<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<body>
				<!-- Halaman 1 — Surat Pengantar -->
				<div style="justify-content: space-between">
					<div style="height:165px">
						<table><tr style="height:0.2px"></tr></table>
						<img height="115px" style="float:right;padding-right:12px;">
							<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
						</img>
					</div>
					<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
						<p style="font-size:16px;padding-bottom:10px">
							Tanggal :
							<span style="padding-left:5px"><xsl:value-of select="root/P_Date"/></span>
						</p>
						<p style="font-size:20px;margin-block-end:30px"><xsl:value-of select="root/P_Name"/></p>
						<p style="margin-block-end:0px;margin-block-start:0px;font-size:16px;padding:2px;padding-left:0px;"><xsl:value-of select="root/P_Address1"/></p>
						<p style="margin-block-end:0px;margin-block-start:0px;font-size:16px;"><xsl:value-of select="root/P_Address2"/></p>
						<p style="margin-block-end:0px;margin-block-start:0px;font-size:16px;"><xsl:value-of select="root/P_Address3"/></p>
						<p style="margin-block-end:60px;margin-block-start:0px;font-size:16px;"><xsl:value-of select="root/P_Address4"/></p>
						<p style="font-size:18px;margin-block-end:25px">
							<u>TERIMA KASIH TELAH MEMILIH ETIQA. KAMI DENGAN BANGGA MEMBERITAHUKAN BAHWA PERLINDUNGAN ANDA KINI TELAH AKTIF</u>
						</p>
						<table style="width:100%;text-align:justify">
							<tr style="height:40px">
								<td style="width:25%;text-align:left;">No. Polis</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;"><xsl:value-of select="root/P_PolicyNo"/></td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:left;">Nama Paket</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;"><xsl:value-of select="root/P_CoverTypeName"/></td>
							</tr>
							<tr style="height:40px">
								<td style="width:25%;text-align:left;">Periode Asuransi</td>
								<td style="width:3%;">:</td>
								<td style="width:72%;"><xsl:value-of select="root/P_PeriodofInsurance"/></td>
							</tr>
						</table>
						<hr style="border-style:solid"/>
						<p style="font-size:16px;margin-block-end:20px">Berikut kami lampirkan dokumen untuk tindakan Anda selanjutnya:-</p>
						<p style="font-size:16px;margin-block-end:20px">Jadwal Polis</p>
						<p style="font-size:16px;margin-block-end:20px">
							Dokumen penting ini merupakan ringkasan dari detail polis Anda dan kami sarankan untuk menyimpannya sebagai referensi.
							Perlu diketahui bahwa informasi yang tercantum dalam jadwal polis ini didasarkan pada keterangan yang Anda berikan kepada kami
							pada saat pengajuan. Kami menyarankan agar Anda memeriksa dokumen ini dengan seksama, dan jika terdapat ketidaksesuaian,
							segera hubungi kami. Konsultan kami siap melayani Anda.
						</p>
						<p style="font-size:16px;margin-block-end:20px">
							Untuk pertanyaan mengenai hal di atas atau produk-produk kami lainnya, silakan hubungi Etiqa di 1 300 13 8888 atau kirimkan
							email kepada kami di info@etiqa.com.my. Untuk klaim, Anda dapat menghubungi Layanan Klaim kami di 1 300 88 1007 untuk
							pelayanan klaim yang cepat dan efisien. Kami kembali mengucapkan selamat datang di keluarga Etiqa.
						</p>
						<p style="font-size:16px;margin-block-start:30px">Hormat Kami,</p>
						<p style="font-size:16px;margin-block-start:30px">Etiqa General Insurance Berhad</p>
						<p style="font-size:16px;margin-block-start:30px">
							Manfaat yang dibayarkan di bawah polis yang memenuhi syarat dilindungi oleh PIDM hingga batas tertentu. Silakan merujuk pada
							<a style="cursor:pointer;text-decoration:none;" href="https://www.pidm.gov.my/en/how-we-protect-you/tips/information-materials/brochures">
								<i>Brosur TIPS PIDM</i>
							</a> atau hubungi Etiqa General Insurance Berhad atau PIDM (kunjungi <a style="cursor:pointer;text-decoration:none;" href="https://www.pidm.gov.my">www.pidm.gov.my</a>).
						</p>
						<br/><br/>
						<p>
							Tanggal Diterbitkan : <xsl:value-of select="root/P_Date"/><br/>
							Oleh : <xsl:value-of select="root/P_AgentCode"/>
						</p>
					</div>
				</div>

				<div style="page-break-after:always"></div>

				<!-- Halaman 2 — Jadwal Polis -->
				<div style="height:165px">
					<table><tr style="height:0.2px"></tr></table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
					</img>
				</div>
				<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
					<div style="display:flex;justify-content:space-between">
						<div style="flex:1;padding-top:0px;">
							<p style="margin-block-start:10px;font-size:18px;padding-right:30px;font-family:Arial,Helvetica,sans-serif;">JADWAL</p>
						</div>
						<div style="flex:1;padding-top:0px;">
							<p style="margin-block-start:10px;font-size:18px;text-align:right;font-family:Arial,Helvetica,sans-serif;border:2px solid black;padding:5px;margin-left:250px;">BEA MATERAI TELAH DIBAYAR</p>
						</div>
					</div>

					<div style="display:flex;justify-content:space-between;font-size:16px;">
						<div style="flex:1;flex-basis:40%;border:2px solid black;padding-left:5px;text-align:left;">
							<p style="font-size:16px;margin:5px;margin-bottom:10px;"><xsl:value-of select="root/P_Name"/></p>
							<p style="font-size:16px;margin:5px;"><xsl:value-of select="root/P_Address1"/></p>
							<p style="font-size:16px;margin:5px;"><xsl:value-of select="root/P_Address2"/></p>
							<p style="font-size:16px;margin:5px;"><xsl:value-of select="root/P_Address3"/></p>
							<p style="font-size:16px;margin:5px;"><xsl:value-of select="root/P_Address4"/></p>
							<p style="font-size:16px;margin:5px;"></p>
						</div>
						<div style="flex:1;flex-basis:60%;border:2px solid black;border-left:0px solid black;padding-left:5px;">
							<table style="width:100%;font-size:16px;">
								<tr>
									<td style="width:35%">Nomor Polis</td>
									<td style="width:3%">:</td>
									<td style="width:62%"><xsl:value-of select="root/P_PolicyNo"/></td>
								</tr>
								<tr>
									<td>Nomor Akun</td>
									<td>:</td>
									<td><xsl:value-of select="root/P_AgentCode"/></td>
								</tr>
								<tr>
									<td>Jenis Produk</td>
									<td>:</td>
									<td><xsl:value-of select="root/P_CoverTypeName"/></td>
								</tr>
								<tr>
									<td colspan="3">
										<p style="text-align:justify;padding-top:5px;">
											Periode Asuransi dari <xsl:value-of select="root/P_StartDate"/> hingga <xsl:value-of select="root/P_EndDate"/> (termasuk kedua tanggal tersebut). Untuk periode berikutnya di mana Pemegang Polis membayar dan Perusahaan Asuransi menyetujui untuk menerima premi perpanjangan.
										</p>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div style="height:10px"></div>

					<div style="border:2px solid black;padding-left:5px;">
						<table style="width:100%;font-size:16px;">
							<tr style="height:30px;">
								<td style="width:45%;">Jumlah Uang Pertanggungan</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;">IDR</td>
								<td style="width:30%;text-align:right;"><xsl:value-of select="root/P_TotalSumInsured"/></td>
							</tr>
							<tr style="height:30px;">
								<td style="width:45%;">Premi Dasar</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;">IDR</td>
								<td style="width:30%;text-align:right;"><xsl:value-of select="root/P_AnnualPremium"/></td>
							</tr>
							<tr style="height:30px;">
								<td style="width:45%;">Manfaat Tambahan:</td>
								<td style="width:5%"></td>
								<td style="width:20%;text-align:right;"></td>
								<td style="width:30%;text-align:right;"></td>
							</tr>
							<xsl:for-each select="root/P_AddOnItem/AddOnItem">
								<tr style="height:30px;">
									<td style="width:45%;"><xsl:value-of select="Name"/></td>
									<td style="width:5%">:</td>
									<td style="width:20%;text-align:right;">IDR</td>
									<td style="width:30%;text-align:right;"><xsl:value-of select="Price"/></td>
								</tr>
							</xsl:for-each>
							<tr style="height:30px;">
								<td style="width:45%;">Total Premi Kotor</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;">IDR</td>
								<td style="width:30%;text-align:right;"><xsl:value-of select="root/P_GrossPremium"/></td>
							</tr>
							<tr style="height:30px;">
								<td style="width:45%;">Diskon (<xsl:value-of select="root/P_DiscountRate"/>%)</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;">(-) IDR</td>
								<td style="width:30%;text-align:right;"><xsl:value-of select="root/P_Discount"/></td>
							</tr>
							<tr style="height:30px;">
								<td style="width:45%;">Premi Kotor Setelah Diskon</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;">IDR</td>
								<td style="width:30%;text-align:right;"><xsl:value-of select="root/P_GrossPremiumAfterDiscount"/></td>
							</tr>
							<tr style="height:30px;">
								<td style="width:45%;">Pajak Layanan (<xsl:value-of select="root/P_TaxRate"/>%)</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;">IDR</td>
								<td style="width:30%;text-align:right;"><xsl:value-of select="root/P_Tax"/></td>
							</tr>
							<tr style="height:30px;">
								<td style="width:45%;">Bea Materai</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;">IDR</td>
								<td style="width:30%;text-align:right;"><xsl:value-of select="root/P_StampDuty"/></td>
							</tr>
							<tr style="height:30px;">
								<td style="width:45%;">Total Premi</td>
								<td style="width:5%">:</td>
								<td style="width:20%;text-align:right;border-top:2px solid black;">IDR</td>
								<td style="width:30%;text-align:right;border-top:2px solid black;"><xsl:value-of select="root/P_Total"/></td>
							</tr>
						</table>
					</div>
					<div style="padding-left:5px;border:2px solid black;margin-top:5px;">
						<table style="width:100%;font-size:16px">
							<tr style="height:40px;">
								<td style="width:45%;">Nomor Risiko</td>
								<td style="width:5%">:</td>
								<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_RiskNo"/></td>
							</tr>
							<tr style="height:40px;">
								<td style="width:45%;">Nomor Referensi IP</td>
								<td style="width:5%">:</td>
								<td style="width:50%;text-align:left;"></td>
							</tr>
							<tr>
								<td style="width:45%;">Lokasi Risiko</td>
								<td style="width:5%">:</td>
								<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_PropertyAddress1"/></td>
							</tr>
							<tr><td></td><td></td><td style="width:50%;text-align:left;"><xsl:value-of select="root/P_PropertyAddress2"/></td></tr>
							<tr><td></td><td></td><td style="width:50%;text-align:left;"><xsl:value-of select="root/P_PropertyAddress3"/></td></tr>
							<tr><td></td><td></td><td style="width:50%;text-align:left;"><xsl:value-of select="root/P_PropertyAddress4"/></td></tr>
						</table>
					</div>
				</div>
				<table><tr style="height:28px"></tr></table>
				<div style="page-break-after:always"></div>

				<!-- Halaman 3 — Detail Pertanggungan -->
				<div style="height:165px">
					<table><tr style="height:0.2px"></tr></table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
					</img>
				</div>
				<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
					<xsl:choose>
						<xsl:when test="root/P_isBuilding = 'true'">
							<div style="padding-left:5px;border:2px solid black;margin-top:5px;">
								<table style="width:100%;font-size:16px;">
									<tr style="height:30px;">
										<td style="width:45%;">Klasifikasi Konstruksi</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_ConstructionClass"/></td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Digunakan Sebagai</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_BuildingType"/></td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Jenis Perlindungan</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_CoverTypeName"/></td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Jenis Tarif</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;">Tarif Dasar</td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Tarif (%)</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_BuildingRate"/></td>
									</tr>
								</table>
								<table style="width:100%;font-size:16px;">
									<tr style="height:30px;">
										<td style="width:45%;">Nomor</td>
										<td style="width:40%" colspan="2">Deskripsi Properti / Kepentingan yang Diasuransikan</td>
										<td style="width:15%;text-align:right;" colspan="2">Uang Pertanggungan</td>
									</tr>
									<tr style="height:40px;">
										<td style="width:45%;">1</td>
										<td style="width:5%">Pada satu unit bangunan</td>
										<td style="width:5%">IDR</td>
										<td style="text-align:right;"><xsl:value-of select="root/P_BuildingSumInsured"/></td>
									</tr>
									<tr style="height:40px;">
										<td style="width:45%;"></td>
										<td style="width:5%;text-align:right;padding-right:30px;">Total:</td>
										<td style="width:5%;border-top:2px dashed black;border-bottom:2px dashed black;padding-right:40px;">IDR</td>
										<td style="border-top:2px dashed black;border-bottom:2px dashed black;text-align:right;" colspan="3"><xsl:value-of select="root/P_BuildingSumInsured"/></td>
									</tr>
								</table>
								<table style="width:100%;font-size:16px;">
									<tr style="height:30px;">
										<td style="width:45%;">Risiko Sendiri</td>
										<td style="width:5%" colspan="2">:</td>
										<td style="width:50%;text-align:left;" colspan="2">Nihil</td>
									</tr>
								</table>
							</div>
						</xsl:when>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="root/P_isContent = 'true'">
							<div style="padding-left:5px;border:2px solid black;margin-top:5px">
								<table style="width:100%;font-size:16px;">
									<tr style="height:30px;">
										<td style="width:45%;">Klasifikasi Konstruksi</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_ConstructionClass"/></td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Digunakan Sebagai</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_BuildingType"/></td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Jenis Perlindungan</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_CoverTypeName"/></td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Jenis Tarif</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;">Tarif Dasar</td>
									</tr>
									<tr style="height:30px;">
										<td style="width:45%;">Tarif (%)</td>
										<td style="width:5%">:</td>
										<td style="width:50%;text-align:left;"><xsl:value-of select="root/P_ContentRate"/></td>
									</tr>
								</table>
								<table style="width:100%;font-size:16px;">
									<tr style="height:30px;">
										<td style="width:45%;">Nomor</td>
										<td style="width:40%" colspan="2">Deskripsi Properti / Kepentingan yang Diasuransikan</td>
										<td style="width:15%;text-align:right;" colspan="2">Uang Pertanggungan</td>
									</tr>
									<tr style="height:40px;">
										<td style="width:45%;">1</td>
										<td style="width:5%">Pada isi rumah</td>
										<td style="width:5%">IDR</td>
										<td style="text-align:right;"><xsl:value-of select="root/P_ContentSumInsured"/></td>
									</tr>
									<tr style="height:40px;">
										<td style="width:45%;"></td>
										<td style="width:5%;text-align:right;padding-right:30px;">Total:</td>
										<td style="width:5%;border-top:2px dashed black;border-bottom:2px dashed black;padding-right:40px;">IDR</td>
										<td style="border-top:2px dashed black;border-bottom:2px dashed black;text-align:right;" colspan="3"><xsl:value-of select="root/P_ContentSumInsured"/></td>
									</tr>
								</table>
								<table style="width:100%;font-size:16px;">
									<tr style="height:30px;">
										<td style="width:45%;">Risiko Sendiri</td>
										<td style="width:5%" colspan="2">:</td>
										<td style="width:50%;text-align:left;" colspan="2">Nihil</td>
									</tr>
								</table>
							</div>
						</xsl:when>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="root/P_isContentDeclaration = 'true'">
							<table style="width:100%;padding-top:20px;border:2px solid black;margin-top:5px;">
								<tr>
									<td style="width:10%;"><u>Nomor</u></td>
									<td style="width:20%;"><u>Jenis</u></td>
									<td style="width:40%;"><u>Deskripsi Properti / Kepentingan yang Diasuransikan</u></td>
									<td style="width:25%;"><u>Nilai Terperinci</u></td>
									<td style="width:10%;"></td>
								</tr>
								<xsl:for-each select="root/P_ContentDeclaration/ContentDeclarationItem">
									<tr>
										<td style="width:10%;"><xsl:value-of select="Number"/></td>
										<td style="width:20%;"><xsl:value-of select="DeclarationType"/></td>
										<td style="width:40%;"><xsl:value-of select="Description"/></td>
										<td style="width:25%;">IDR</td>
										<td style="width:10%;"><xsl:value-of select="Value"/></td>
									</tr>
								</xsl:for-each>
								<xsl:choose>
									<xsl:when test="root/P_needAdditionalPage = 'false'">
										<tr style="height:30px;"></tr>
										<tr style="height:35px;">
											<td style="width:10%;"></td>
											<td style="width:20%;"></td>
											<td style="width:40%;text-align:right;padding-right:20px;">Total:</td>
											<td style="width:25%;border-top:2px dashed black;border-bottom:2px dashed black">IDR</td>
											<td style="width:10%;border-top:2px dashed black;border-bottom:2px dashed black"><xsl:value-of select="root/P_TotalContentDeclaration"/></td>
										</tr>
									</xsl:when>
								</xsl:choose>
							</table>
						</xsl:when>
					</xsl:choose>
				</div>
				<table><tr style="height:28px"></tr></table>
				<div style="page-break-after:always"></div>

				<!-- Halaman 3+1 — Halaman Tambahan -->
				<xsl:choose>
					<xsl:when test="root/P_needAdditionalPage = 'true'">
						<div style="height:140px">
							<table><tr style="height:0.2px"></tr></table>
							<img height="115px" style="float:right;margin-right:-21px">
								<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
							</img>
						</div>
						<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
							<table style="width:100%;padding-top:20px;border:2px solid black;">
								<xsl:for-each select="root/P_ContentDeclaration2/ContentDeclarationItem2">
									<tr>
										<td style="width:10%;"><xsl:value-of select="Number"/></td>
										<td style="width:20%;"><xsl:value-of select="DeclarationType"/></td>
										<td style="width:40%;"><xsl:value-of select="Description"/></td>
										<td style="width:25%;">IDR</td>
										<td style="width:10%;"><xsl:value-of select="Value"/></td>
									</tr>
								</xsl:for-each>
								<tr style="height:30px;"></tr>
								<tr style="height:35px;">
									<td style="width:10%;"></td>
									<td style="width:20%;"></td>
									<td style="width:40%;text-align:right;padding-right:20px;">Total:</td>
									<td style="width:25%;border-top:2px dashed black;border-bottom:2px dashed black">IDR</td>
									<td style="width:10%;border-top:2px dashed black;border-bottom:2px dashed black"><xsl:value-of select="root/P_TotalContentDeclaration"/></td>
								</tr>
							</table>
						</div>
						<div style="page-break-after:always"></div>
					</xsl:when>
				</xsl:choose>

				<!-- Halaman 4 — Klausul dan Endorsemen -->
				<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
					<div style="height:140px">
						<table><tr style="height:0.2px"></tr></table>
						<img height="115px" style="float:right;margin-right:-21px">
							<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
						</img>
					</div>
					<div style="border:1px solid black;padding:10px;">
						<p>Tunduk pada jaminan, endorsemen, dan klausul berikut yang tergabung dan menjadi bagian dari e-Polis ini:</p>
						<table style="width:100%;border-collapse:collapse;">
							<thead>
								<tr>
									<th style="text-align:left;padding:5px;">Kode Klausul</th>
									<th style="text-align:left;padding:5px;">Nama Klausul / Bahaya</th>
									<th style="text-align:left;padding:5px;">Tarif</th>
								</tr>
							</thead>
							<tbody>
								<tr><td style="padding:5px;">C008</td><td style="padding:5px;">KLAUSUL PENGECUALIAN FONDASI</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">C42B</td><td style="padding:5px;">PENGAKUAN TANGGAL (KHUSUS POLIS RUMAH TINGGAL)</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">C045</td><td style="padding:5px;">KLAUSUL KLARIFIKASI KERUSAKAN PROPERTI</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">W026</td><td style="padding:5px;">JAMINAN PREMI</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">M002</td><td style="padding:5px;">INFORMASI IMB/CSB (SESUAI PEMBERITAHUAN PENTING TERLAMPIR)</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">C046</td><td style="padding:5px;">KLAUSUL PENGECUALIAN ASBES (BERLAKU UNTUK SEKSI IIIB SAJA)</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">C047</td><td style="padding:5px;">KLAUSUL PENGECUALIAN RISIKO RADIOAKTIF / ENERGI NUKLIR</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">W001</td><td style="padding:5px;">JAMINAN PEMBATASAN BARANG DAGANGAN</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">C049</td><td style="padding:5px;">KLAUSUL DISTRIBUSI SURPLUS ASURANSI</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">M007</td><td style="padding:5px;">PENGECUALIAN SIBER DAN DATA</td><td style="padding:5px;"></td></tr>
								<tr><td style="padding:5px;">C051</td><td style="padding:5px;">ENDORSEMEN PENYAKIT MENULAR</td><td style="padding:5px;"></td></tr>
								<xsl:choose>
									<xsl:when test="root/P_IsRsmdAddOnExist = 'true'">
										<tr>
											<td style="padding:5px;"><xsl:value-of select="root/P_RsmdAddOnCode"/></td>
											<td style="padding:5px;"><xsl:value-of select="root/P_RsmdAddOnName"/></td>
											<td style="padding:5px;">
												<xsl:choose>
													<xsl:when test="root/P_IsLppsa != 'true'"><xsl:value-of select="root/P_RsmdAddOnRate"/>%</xsl:when>
												</xsl:choose>
											</td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsExtendedTheftAddOnExist = 'true'">
										<tr>
											<td style="padding:5px;"><xsl:value-of select="root/P_ExtendedTheftAddOnCode"/></td>
											<td style="padding:5px;"><xsl:value-of select="root/P_ExtendedTheftAddOnName"/></td>
											<td style="padding:5px;"><xsl:value-of select="root/P_ExtendedTheftAddOnRate"/>%</td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsSubsidenceAndLandslideAddOnExist = 'true'">
										<tr>
											<td style="padding:5px;"><xsl:value-of select="root/P_SubsidenceAndLandslideAddOnCode"/></td>
											<td style="padding:5px;"><xsl:value-of select="root/P_SubsidenceAndLandslideAddOnName"/></td>
											<td style="padding:5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="root/P_IsDamagesByFailingTreeAddOnExist = 'true'">
										<tr>
											<td style="padding:5px;"><xsl:value-of select="root/P_DamagesByFailingTreeAddOnCode"/></td>
											<td style="padding:5px;"><xsl:value-of select="root/P_DamagesByFailingTreeAddOnName"/></td>
											<td style="padding:5px;"></td>
										</tr>
									</xsl:when>
								</xsl:choose>
							</tbody>
						</table>

						<p style="margin-top:20px;">PENGECUALIAN SIBER DAN DATA</p>
						<p>Meskipun terdapat ketentuan yang bertentangan dalam Polis ini atau endorsemen apapun di dalamnya, Polis ini mengecualikan setiap:</p>
						<p>1.1 Kerugian Siber;</p>
						<table>
							<td style="vertical-align:top;text-align:left;">1.2</td>
							<td style="text-align:justify;">
								Kehilangan, kerusakan, kewajiban, klaim, biaya, pengeluaran dalam bentuk apapun yang secara langsung atau tidak langsung disebabkan oleh, berkontribusi pada, diakibatkan dari, timbul dari atau berhubungan dengan kehilangan penggunaan, penurunan fungsi, perbaikan, penggantian, pemulihan atau reproduksi Data apapun, termasuk jumlah apapun yang berkaitan dengan nilai Data tersebut; tanpa memandang penyebab atau peristiwa lain yang berkontribusi secara bersamaan atau dalam urutan lain. Jika bagian manapun dari endorsemen ini dinyatakan tidak sah atau tidak dapat dilaksanakan, bagian lainnya tetap berlaku penuh. Endorsemen ini menggantikan, dan jika bertentangan dengan tulisan lain dalam Asuransi atau endorsemen apapun yang berkaitan dengan Kerugian Siber atau Data, menggantikan tulisan tersebut.
							</td>
						</table>

						<p style="margin-top:20px;">Definisi</p>
						<p>
							Kerugian Siber berarti setiap kerugian, kerusakan, kewajiban, klaim, biaya atau pengeluaran dalam bentuk apapun yang secara langsung atau tidak langsung disebabkan oleh, berkontribusi pada, diakibatkan dari, timbul dari atau berhubungan dengan Tindakan Siber atau Insiden Siber apapun, termasuk namun tidak terbatas pada tindakan apapun yang diambil dalam mengendalikan, mencegah, menekan atau memulihkan Tindakan Siber atau Insiden Siber. Tindakan Siber berarti tindakan yang tidak sah, berbahaya atau kriminal atau serangkaian tindakan yang tidak sah, berbahaya atau kriminal yang terkait, tanpa memandang waktu dan tempat, atau ancaman atau tipuan tersebut yang melibatkan akses ke, pemrosesan, penggunaan atau pengoperasian Sistem Komputer apapun.
						</p>
						<p>Insiden Siber berarti:</p>
						<ol style="margin-left:10px;">
							<li>Kesalahan atau kelalaian atau serangkaian kesalahan atau kelalaian yang terkait yang melibatkan akses ke, pemrosesan, penggunaan atau pengoperasian Sistem Komputer; atau</li>
							<li>Ketidaktersediaan parsial atau total atau serangkaian ketidaktersediaan parsial atau total yang terkait atau kegagalan untuk mengakses, memproses, menggunakan atau mengoperasikan Sistem Komputer.</li>
						</ol>
						<p>Sistem Komputer berarti:</p>
						<p>Komputer, perangkat keras, perangkat lunak, sistem komunikasi, perangkat elektronik apapun (termasuk namun tidak terbatas pada ponsel pintar, laptop, tablet, perangkat yang dapat dikenakan), server, cloud atau mikrokontroler termasuk sistem serupa atau konfigurasi apapun dari hal-hal yang disebutkan di atas dan termasuk input, output, perangkat penyimpanan data, peralatan jaringan atau fasilitas cadangan terkait apapun, yang dimiliki atau dioperasikan oleh Tertanggung atau pihak lain manapun.</p>
						<p style="padding-bottom:50px;">Data berarti informasi, fakta, konsep, kode atau informasi lain dalam bentuk apapun yang direkam atau ditransmisikan dalam suatu format untuk digunakan, diakses, diproses, ditransmisikan atau disimpan oleh Sistem Komputer.</p>
					</div>
				</div>
				<table><tr style="height:30px"></tr></table>
				<div style="page-break-after:always"></div>

				<!-- Halaman 5 — Endorsemen Penyakit Menular -->
				<div style="height:150px">
					<table><tr style="height:0.2px"></tr></table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
					</img>
				</div>
				<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
					<div style="border:1px solid black;padding:10px;">
						<p style="text-align:left;margin-bottom:20px;">ENDORSEMEN PENYAKIT MENULAR</p>
						<table>
							<td style="vertical-align:top;text-align:left;">1.</td>
							<td style="text-align:justify;padding-left:15px;">
								Polis ini, tunduk pada semua syarat, ketentuan dan pengecualian yang berlaku, menanggung kerugian yang disebabkan oleh kerugian fisik langsung atau kerusakan fisik yang terjadi selama periode asuransi. Oleh karena itu, dan meskipun terdapat ketentuan lain dalam polis ini yang bertentangan, polis ini tidak menanggung kerugian, kerusakan, kewajiban, klaim, biaya atau pengeluaran dalam bentuk apapun, baik secara langsung maupun tidak langsung yang disebabkan oleh, timbul dari, diakibatkan dari, dapat diatribusikan ke atau berhubungan dengan (tanpa memandang apakah terjadi secara bersamaan atau dalam urutan apapun) Penyakit Menular atau ketakutan atau ancaman (baik aktual maupun yang dipersepsikan) dari Penyakit Menular.
							</td>
						</table>
						<table>
							<td style="vertical-align:top;text-align:left;">2.</td>
							<td style="text-align:justify;padding-left:15px;">
								Untuk keperluan endorsemen ini, kerugian, kerusakan, kewajiban, klaim, biaya atau pengeluaran dalam bentuk apapun termasuk namun tidak terbatas pada biaya apapun untuk membersihkan, mendetoksifikasi, memindahkan, memantau atau menguji:
							</td>
						</table>
						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align:top;text-align:left;">2.1</td>
								<td style="text-align:justify;padding-left:15px;">suatu Penyakit Menular, atau</td>
							</tr>
							<tr>
								<td style="vertical-align:top;text-align:left;">2.2</td>
								<td style="text-align:justify;padding-left:15px;">properti apapun yang diasuransikan di sini yang terkena Penyakit Menular tersebut.</td>
							</tr>
						</table>
						<table>
							<td style="vertical-align:top;text-align:left;">3.</td>
							<td style="text-align:justify;padding-left:15px;">
								Sebagaimana digunakan di sini, Penyakit Menular berarti penyakit apapun yang dapat ditularkan melalui zat atau agen apapun dari organisme satu ke organisme lain di mana:
							</td>
						</table>
						<table style="padding-left:30px;">
							<tr>
								<td style="vertical-align:top;text-align:left;">3.1</td>
								<td style="text-align:justify;padding-left:15px;">zat atau agen tersebut termasuk namun tidak terbatas pada virus, bakteri, parasit atau organisme lain atau variasinya, baik yang dianggap hidup atau tidak, dan</td>
							</tr>
							<tr>
								<td style="vertical-align:top;text-align:left;">3.2</td>
								<td style="text-align:justify;padding-left:15px;">cara penularan, baik langsung maupun tidak langsung, termasuk namun tidak terbatas pada penularan melalui udara, penularan melalui cairan tubuh, penularan dari atau ke permukaan atau objek apapun, padat, cair atau gas atau antar organisme, dan</td>
							</tr>
							<tr>
								<td style="vertical-align:top;text-align:left;">3.3</td>
								<td style="text-align:justify;padding-left:15px;">penyakit, zat atau agen tersebut dapat menyebabkan atau mengancam kerusakan pada kesehatan manusia atau kesejahteraan manusia atau dapat menyebabkan atau mengancam kerusakan pada, penurunan nilai, kehilangan nilai, kemampuan dipasarkan atau kehilangan penggunaan properti yang diasuransikan di sini.</td>
							</tr>
						</table>
						<table style="width:100%;">
							<td style="vertical-align:top;text-align:left;">4.</td>
							<td style="text-align:justify;padding-left:15px;">Endorsemen ini berlaku untuk semua perluasan cakupan, cakupan tambahan, pengecualian terhadap pengecualian apapun dan pemberian cakupan lainnya.</td>
						</table>
						<p style="padding-left:35px;">Semua syarat, ketentuan dan pengecualian polis lainnya tetap sama.</p>

						<p style="text-align:left;margin-top:20px;">KLAUSUL PEMBATASAN DAN PENGECUALIAN SANKSI</p>
						<p>E-Polis ini tidak memberikan perlindungan dan Perusahaan tidak berkewajiban membayar klaim atau memberikan manfaat apapun di bawah ini sejauh penyediaan perlindungan, pembayaran klaim atau penyediaan manfaat tersebut akan mengekspos Perusahaan pada Sanksi, larangan atau pembatasan berdasarkan Undang-Undang CISAD atau Resolusi Perserikatan Bangsa-Bangsa atau sanksi perdagangan atau ekonomi, hukum atau peraturan dari Uni Eropa, Inggris.</p>

						<p style="text-align:left;margin-top:20px;">Batas Tanggung Jawab</p>
						<p>1. Kami tidak bertanggung jawab atas:</p>
						<table style="width:100%;padding-left:30px;">
							<tr>
								<td>a)</td>
								<td style="text-align:justify;padding-left:5px;">Untuk peristiwa yang diasuransikan 5 untuk IDR 50.000 pertama.</td>
							</tr>
							<tr>
								<td style="vertical-align:top;text-align:left;">b)</td>
								<td style="text-align:justify;padding-left:5px;">Untuk peristiwa yang diasuransikan 7, 8 dan 9 untuk satu (1) persen pertama dari Jumlah Uang Pertanggungan atas Bangunan atau IDR 200.000 mana yang lebih rendah.</td>
							</tr>
						</table>
						<table style="width:100%;">
							<td style="vertical-align:top;text-align:left;">2.</td>
							<td style="text-align:justify;padding-left:15px;">Batas jumlah tanggung jawab Kami di bawah Manfaat Tambahan C) Santunan Kematian: IDR 10.000.000 atau setengah dari Jumlah Uang Pertanggungan atas Isi mana yang lebih rendah.</td>
						</table>
						<table style="width:100%;">
							<td style="vertical-align:top;text-align:left;">3.</td>
							<td style="text-align:justify;padding-left:15px;">Batas jumlah tanggung jawab Kami di bawah Manfaat Tambahan F) Tanggung Jawab kepada Publik: IDR 50.000.000 untuk satu kecelakaan atau serangkaian kecelakaan yang merupakan satu kejadian sehubungan dengan Bangunan dan Isi masing-masing.</td>
						</table>
						<table style="width:100%;">
							<td style="width:25px;">4.</td>
							<td style="text-align:justify;">Wilayah Geografis: Indonesia</td>
						</table>

						<p style="text-align:left;margin-top:20px;">INFORMASI PENJAMINAN</p>
						<p><u>Apakah salah satu pernyataan berikut berlaku untuk Anda?</u></p>
						<table style="width:100%;">
							<tr>
								<td style="vertical-align:top;text-align:left;">1.</td>
								<td style="text-align:justify;padding-left:15px;">Saya pernah mengajukan klaim atau mengalami kerugian dalam dua tahun terakhir atas properti ini atau properti lainnya.</td>
							</tr>
							<tr><td></td><td style="text-align:justify;padding-left:15px;">Tidak</td></tr>
							<tr>
								<td style="vertical-align:top;text-align:left;">2.</td>
								<td style="text-align:justify;padding-left:15px;">Tempat tinggal ini akan ditinggalkan tanpa penghuni selama lebih dari 90 hari.</td>
							</tr>
							<tr><td></td><td style="text-align:justify;padding-left:15px;">Tidak</td></tr>
							<xsl:choose>
								<xsl:when test="root/P_StampDuty = 'true'">
									<tr>
										<td></td>
										<td style="text-align:justify;padding-left:15px;padding-top:15px;">Polis ini memenuhi syarat untuk pembebasan bea materai.</td>
									</tr>
								</xsl:when>
							</xsl:choose>
						</table>
					</div>
				</div>
				<div style="page-break-after:always"></div>

				<!-- Halaman 6 — Kewajiban Pengungkapan -->
				<div style="height:165px">
					<table><tr style="height:0.2px"></tr></table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
					</img>
				</div>
				<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
					<div style="border:1px solid black;padding:10px;">
						<p style="text-align:left;margin-bottom:20px;">KEWAJIBAN PENGUNGKAPAN ANDA</p>
						<p>
							Di mana Anda telah mengajukan Asuransi ini sepenuhnya untuk tujuan yang tidak terkait dengan perdagangan, bisnis atau profesi Anda, Anda berkewajiban untuk berhati-hati agar tidak memberikan pernyataan yang salah dalam menjawab pertanyaan dalam Formulir Permohonan (atau ketika Anda mengajukan Asuransi ini), yaitu Anda seharusnya menjawab pertanyaan secara lengkap dan akurat. Kegagalan untuk berhati-hati dalam menjawab pertanyaan dapat mengakibatkan pembatalan kontrak Asuransi Anda, penolakan atau pengurangan klaim Anda, perubahan syarat atau pengakhiran kontrak Asuransi Anda sesuai dengan ketentuan yang berlaku.
						</p>
						<p>
							Anda juga berkewajiban untuk memberitahukan kami segera jika setiap saat setelah kontrak Asuransi Anda dibuat, diubah atau diperbarui dengan Kami, informasi apapun yang diberikan dalam Formulir Permohonan (atau ketika Anda mengajukan Asuransi ini) tidak akurat atau telah berubah.
						</p>
						<p style="text-align:left;margin-top:20px;">PERUBAHAN DALAM PERPAJAKAN, PERATURAN DAN PERUNDANG-UNDANGAN</p>
						<p>
							Kami dapat mengubah syarat-syarat Polis ini jika terdapat perubahan dalam perpajakan, peraturan atau perundang-undangan yang mempengaruhi Polis ini. Kami akan memberitahukan Anda secara tertulis ketika syarat-syarat dalam Polis ini perlu diubah.
						</p>
						<xsl:choose>
							<xsl:when test="root/P_IsLppsa = 'true'">
								<p>Jika pajak semacam itu berlaku, menjadi kewajiban Anda untuk membayar pajak yang dikenakan tersebut (jika berlaku).</p>
								<p style="padding-bottom:30px;">Dalam hal Anda tidak membayar pajak pertambahan nilai, pajak barang dan jasa atau pajak serupa lainnya, Kami dapat, tetapi tidak berkewajiban, membayar pajak tersebut atas nama Anda, dan Anda wajib mengganti atau mengganti rugi Kami atas semua pajak tersebut atas permintaan Kami.</p>
							</xsl:when>
							<xsl:otherwise>
								<p style="padding-bottom:100px;"></p>
							</xsl:otherwise>
						</xsl:choose>
					</div>
					<div>
						<table style="width:100%;padding-top:20px;">
							<tr>
								<td style="width:20%;">Tanggal Diterbitkan</td>
								<td style="width:5%;">:</td>
								<td style="width:40%;"><xsl:value-of select="root/P_Date"/></td>
								<td style="width:35%;text-align:right;">Untuk dan atas nama,</td>
							</tr>
							<tr>
								<td style="width:20%;">Oleh</td>
								<td style="width:5%;">:</td>
								<td style="width:40%;text-align:justify;"><xsl:value-of select="root/P_AgentCode"/></td>
								<td style="width:35%;text-align:right;">Etiqa General Insurance Berhad</td>
							</tr>
							<tr>
								<td colspan="4" style="height:70px;">Jadwal Polis ini adalah dokumen yang dihasilkan komputer dan tidak memerlukan tanda tangan</td>
							</tr>
						</table>
					</div>
				</div>
				<div style="page-break-after:always"></div>

				<!-- Halaman 7 — Perlindungan Data Pribadi -->
				<div style="height:120px">
					<table><tr style="height:0.2px"></tr></table>
					<img height="115px" style="float:right;padding-right:12px;">
						<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnHeader"/></xsl:attribute>
					</img>
				</div>
				<div style="padding-left:30px;padding-right:30px;text-align:justify;font-family:Arial,Helvetica,sans-serif;line-height:1.1499023;">
					<div style="border:1px solid black;height:1050px">
						<p style="font-size:20px;border-bottom:1px solid black;margin-block-start:0px;padding:6px;background-color:#ffc000;margin-block-end:5px;text-align:center;padding-bottom:15px;padding-top:15px;">
							Slip Persetujuan Perlindungan Data Pribadi untuk Nasabah Individu
						</p>
						<table style="width:100%;">
							<tr style="height:40px;">
								<td style="width:30%;">Nama</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;text-align:justify;"><xsl:value-of select="root/P_Name"/></td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">No. KTP</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;"><xsl:value-of select="root/P_Nric"/></td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">No. Polis</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;"><xsl:value-of select="root/P_PolicyNo"/></td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Jenis Polis</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;">Asuransi Umum</td>
							</tr>
							<tr style="height:40px;">
								<td style="width:30%;">Tanggal</td>
								<td style="width:5%;">:</td>
								<td style="width:65%;"><xsl:value-of select="root/P_Date"/></td>
							</tr>
						</table>
						<div style="font-size:16px;font-family:Arial,Helvetica,sans-serif;text-align:justify;margin:10px;">
							<p>
								Saya menyetujui dan mengizinkan Etiqa General Insurance Berhad (selanjutnya disebut "Etiqa General Insurance") untuk memproses data pribadi saya (termasuk data pribadi sensitif) ("Data Pribadi") dengan tujuan untuk membuat kontrak Asuransi, sesuai dengan ketentuan Undang-Undang Perlindungan Data Pribadi yang berlaku.
							</p>
							<p>
								Saya memahami dan menyetujui bahwa Data Pribadi apapun yang dikumpulkan atau dimiliki oleh Etiqa General Insurance (baik yang terdapat dalam permohonan ini maupun yang diperoleh kemudian) dapat disimpan, digunakan, diproses dan diungkapkan oleh Etiqa General Insurance kepada individu dan/atau organisasi yang terkait dan berasosiasi dengan Etiqa General Insurance atau pihak ketiga pilihan manapun (di dalam atau di luar Indonesia, termasuk institusi medis, reasuransi, adjuster klaim/investigator, pengacara, asosiasi industri, regulator, badan hukum dan otoritas pemerintah) untuk tujuan memproses permohonan ini dan memberikan layanan terkait selanjutnya serta untuk berkomunikasi dengan saya untuk tujuan tersebut.
							</p>
							<p>
								Saya memahami bahwa saya berhak untuk mendapatkan akses dan meminta koreksi atas Data Pribadi yang disimpan oleh Etiqa General Insurance mengenai saya. Permintaan tersebut dapat dilakukan dengan mengisi Formulir Permintaan Akses yang tersedia di situs web Etiqa, semua cabang Etiqa Insurance atau hubungi Etiqa General Insurance melalui email di PDPA@etiqa.com.my. Sesuai dengan ketentuan Undang-Undang Perlindungan Data Pribadi, saya dapat menghubungi Pusat Layanan Pelanggan Etiqa Online di 1 300 13 8888 untuk detail Data Pribadi saya. Informasi tersebut hanya akan diberikan setelah verifikasi.
							</p>
							<p>
								Saya menyetujui dan mengizinkan Etiqa General Insurance untuk berbagi Data Pribadi saya dengan Grup Maybank, agen Etiqa Insurance atau mitra strategis dan pihak ketiga lainnya ("entitas lain") sesuai kebijaksanaan Etiqa General Insurance dan saya dapat menerima komunikasi pemasaran dari Etiqa General Insurance atau dari entitas lain ini mengenai produk dan layanan yang mungkin menarik bagi saya.
							</p>
							<div>
								<table style="width:100%;padding-top:15px;padding-bottom:15px;">
									<tr>
										<xsl:choose>
											<xsl:when test="root/P_Checked = 'false'">
												<div style="display:flex;">
													<td style="width:50%;padding-bottom:35px;padding-left:300px">
														<img height="66px"><xsl:attribute name="src"><xsl:value-of select="root/ImageUnchecked"/></xsl:attribute></img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Ya</p>
													</td>
												</div>
												<div style="display:flex;">
													<td style="width:50%;padding-left:30px;padding-bottom:35px;">
														<img height="70px"><xsl:attribute name="src"><xsl:value-of select="root/ImageChecked"/></xsl:attribute></img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:90px;margin-top:-42px">Tidak</p>
													</td>
												</div>
											</xsl:when>
											<xsl:when test="root/P_Checked = 'true'">
												<div style="display:flex;">
													<td style="width:50%;padding-bottom:35px;padding-left:300px">
														<img height="70px"><xsl:attribute name="src"><xsl:value-of select="root/ImageChecked"/></xsl:attribute></img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:80px;margin-top:-42px">Ya</p>
													</td>
												</div>
												<div style="display:flex;">
													<td style="width:50%;padding-left:40px;padding-bottom:35px;">
														<img height="66px"><xsl:attribute name="src"><xsl:value-of select="root/ImageUnchecked"/></xsl:attribute></img>
														<p style="font-size:20px;margin-block-start:0px;margin-block-end:0px;margin-left:70px;margin-top:-42px">Tidak</p>
													</td>
												</div>
											</xsl:when>
										</xsl:choose>
									</tr>
								</table>
							</div>
							<p>
								Catatan: Jika Anda tidak ingin lagi menerima komunikasi pemasaran, silakan beritahukan Etiqa General Insurance untuk menarik persetujuan Anda dan Etiqa General Insurance akan berhenti memproses dan berbagi Data Pribadi Anda dengan entitas lain ini untuk tujuan pengiriman komunikasi pemasaran kepada Anda. Untuk menghindari keraguan, penarikan ini tidak mencakup pemrosesan Data Pribadi wajib Anda.
							</p>
							<p style="font-size:18px;padding-top:50px;padding-bottom:30px;">
								INI ADALAH DOKUMEN YANG DIHASILKAN KOMPUTER DAN TIDAK MEMERLUKAN TANDA TANGAN
							</p>
						</div>
					</div>
				</div>
				<table><tr style="height:90px"></tr></table>
				<div style="margin-top:80px;bottom:0;margin-left:5px;margin-right:5px;">
					<img height="70px;" width="100%;">
						<xsl:attribute name="src"><xsl:value-of select="root/ImageEgibEnFooter"/></xsl:attribute>
					</img>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
