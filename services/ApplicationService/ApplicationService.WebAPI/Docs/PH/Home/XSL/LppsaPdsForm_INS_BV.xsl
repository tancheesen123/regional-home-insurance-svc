<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<meta charset="UTF-8" />
			<style></style>

			<body>
				<div style="padding-left: 40px; padding-right: 40px">
					<div style="height: 30px"></div>
					<div style="height: 145px">
						<table>
							<tr style="height: 0.2px"></tr>
						</table>
						<img height="140px" style="float: right">
							<xsl:attribute name="src">
								<xsl:value-of select="root/ImageEgibBmHeader" />
							</xsl:attribute>
						</img>
					</div>
					<table
					  cellpadding="0"
					  cellspacing="0"
					  border="0"
					  style="empty-cells: show; width: 100%; border-collapse: collapse"
          >
						<tr>
							<td
							  width="50%"
							  style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  border: 1px solid #171710;
                  padding: 10px;
                  text-align: justify;
                "
              >
								<b
								  style="
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.1499023;
                  "
                  >HELAIAN PENDEDAHAN PRODUK</b
                >
							</td>
							<td
							  width="50%"
							  style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  border: 1px solid #171710;
                  padding: 10px;
                  text-align: justify;
                "
              >
								<b
								  style="
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.1499023;
                  "
                  >Etiqa General Insurance Berhad (‘’Kami’’)</b
                >
							</td>
						</tr>
						<tr>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 10px;
                  padding-bottom: 27px;
                  text-align: justify;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 14px;
                  line-height: 1.1499023;
                "
              >
								Sila baca Helaian Pendedahan Produk ini sebelum anda membuat
								keputusan untuk menyertai <b>Insurans Isi Rumah.</b>
								Pastikan anda juga membaca terma-terma dan syarat-syarat am.
							</td>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 10px;
                  text-align: justify;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 14px;
                  line-height: 1.1499023;
                "
              >
								<b> Insurans Isi Rumah </b>
								<br />
								<br />
								<b>
									Tarikh : <xsl:value-of select="root/P_Date" />
								</b>
								<br />
								<br />
							</td>
						</tr>
					</table>
				</div>
				<div
				  style="
            padding-left: 40px;
            padding-right: 40px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<p style="margin-block-end: 0px; font-size: 14px">
						<b>
							<span style="padding-right: 5px">1.</span> Apakah produk ini?
						</b>
						<br />
						<td>
							<p
							  style="
                  margin-block-start: 0px;
                  font-size: 14px;
                  padding-left: 20px;
                "
              >
								Produk ini menawarkan perlindungan kepada bangunan (kediaman
								persendirian) anda dan kandungan isi rumah serta barangan
								peribadi di dalam rumah anda.
							</p>
						</td>
					</p>

					<p style="margin-block-end: 0px; font-size: 14px">
						<b>
							<span style="padding-right: 5px">2.</span> Apakah jenis-jenis
							perlindungan/manfaat yang diberi?
						</b>
					</p>
					<span style="font-size: 14px; padding-left: 20px">
						Jenis-jenis manfaat adalah seperti berikut:
					</span>
					<br />
					<div style="padding-left: 20px">
						<table
						  cellpadding="0"
						  cellspacing="0"
						  border="0"
						  style="empty-cells: show; width: 100%; border-collapse: collapse"
            >
							<tr>
								<td
								  width="100%"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                  "
                >
									<b
									  style="
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 16px;
                      line-height: 1.1499023;
                    "
                    >Jenis Manfaat</b
                  >
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Kebakaran, kilat dan letupan yang disebabkan oleh gas yang
									digunakan untuk tujuan domestik
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Pesawat udara dan/atau peranti udara yang gugur daripadanya
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Hentaman oleh sebarang kenderaan atau haiwan
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Pecahan atau limpahan tangki air domestik atau paip
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Kecurian dengan pemecahan menggunakan kekerasan dan keganasan
									ke dalam dan keluar dari rumah
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Ribut, puting beliung dan angin taufan
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Gempa bumi dan letusan gunung berapi
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Banjir
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Kerugian sewa (Had 10% daripada Jumlah Dilindungi)
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Liabiliti pihak ketiga untuk kemalangan di dalam rumah anda –
									had limit sehingga RM50,000
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Harta yang dipindahkan sementara - sehingga 15% daripada
									jumlah dilindungi pada kandungan rumah
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Kerosakan kepada cermin, selain dari cermin tangan - sehingga
									RM500 setiap keping untuk setiap kemalangan
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Pampasan Kematian Peserta, disebabkan oleh kebakaran atau
									rompakan di mana terdapat kemasukan ganas dan secara paksa ke
									rumah - Had RM10,000 atau satu perdua daripada Keseluruhan
									Jumlah Dilindungi ke atas kandungan yang mana lebih rendah
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Harta orang gaji
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Rusuhan, mogok dan kerosakan akibat keganasan
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Penenggelaman dan gelinciran tanah
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Kerosakan oleh pokok tumbang atau dahan atau objek daripadanya
								</td>
							</tr>
						</table>
					</div>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 5px;
              font-size: 14px;
              padding-left: 20px;
              padding-top: 10px;
            "
          >
						Anda boleh memperluaskan perlindungan dengan membayar premium
						tambahan:
					</p>
					<div style="padding-left: 20px;">
						<table
						  cellpadding="0"
						  cellspacing="0"
						  border="0"
						  style="empty-cells: show; width: 100%; border-collapse: collapse"
            >
							<tr>
								<td
								  width="100%"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                  "
                >
									<b
									  style="
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 16px;
                      line-height: 1.1499023;
                    "
                    >Jenis Manfaat</b
                  >
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Meningkatkan had liabiliti kepada Awam sehingga had maksimum
									RM250,000
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Meningkatkan had kerugian sewa
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Ditinggalkan tidak berpenghuni untuk lebih dari 90 hari
								</td>
							</tr>
							<tr>
								<td
								  style="
                    pointer-events: auto;
                    text-indent: 0px;
                    border: 1px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 1.1499023;
                  "
                >
									Kerugian akibat kecurian tanpa pemecahan masuk dan/atau keluar
									rumah menggunakan kekerasan dan keganasan sebenar tidak
									termasuk kecurian oleh orang gaji atau ahli keluarga
								</td>
							</tr>
						</table>
					</div>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 5px;
              font-size: 14px;
              padding-left: 20px;
              padding-top: 10px;
            "
          >
						Tempoh perlindungan adalah satu tahun. Anda perlu memperbaharui
						kontrak polisi setiap tahun.
					</p>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 5px;
              font-size: 14px;
              padding-left: 20px;
            "
          >
						<b>Note:</b> Sila rujuk kontrak polisi untuk maklumat lanjut
						berkenaan manfaat- manfaat di atas.
					</p>

					<p style="margin-block-end: 0px; font-size: 14px">
						<b>
							<span style="padding-right: 5px">3.</span> Berapakah jumlah
							perlindungan dan jumlah premium yang perlu saya bayar?
						</b>
					</p>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 8px;
              font-size: 14px;
              padding-left: 20px;
            "
          >
						Jumlah premium tahunan yang perlu anda bayar adalah dikira
						berdasarkan jumlah perlindungan dan perlindungan tambahan, jika ada.
					</p>
					<div style="padding-left: 20px">
						<table
						  cellpadding="0"
						  cellspacing="0"
						  border="0"
						  style="width: 80%; border-collapse: collapse; font-size: 14px"
            >
							<tr style="font-size: 14px">
								<th
								  rowspan="2"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Pelan
								</th>
								<th
								  rowspan="2"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Jumlah Dilindungi (RM)
								</th>
								<th
								  colspan="3"
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Sumbangan Asas Mengikut Kelas Pembinaan (RM)
								</th>
							</tr>
							<tr style="font-size: 14px">
								<th
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Kelas 1A
								</th>
								<th
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Kelas 1B
								</th>
								<th
								  style="
                    pointer-events: auto;
                    background-color: #ffc000;
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									Kelas 2
								</th>
							</tr>
							<tr
							  style="
                  border: 1px solid #171710;
                  text-align: center;
                  font-size: 14px;
                  padding: 2px 10px;
                "
              >
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    font-size: 14px;
                  "
                >
									A
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    font-size: 14px;
                    padding: 2px 10px;
                  "
                >
									20,000
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    font-size: 14px;
                    padding: 2px 10px;
                  "
                >
									87.80
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    font-size: 14px;
                    padding: 2px 10px;
                  "
                >
									124.20
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    font-size: 14px;
                    padding: 2px 10px;
                  "
                >
									150.20
								</td>
							</tr>
							<tr
							  style="
                  border: 1px solid #171710;
                  text-align: center;
                  font-size: 14px;
                  padding: 2px 10px;
                "
              >
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									B
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									30,000
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									131.70
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									186.30
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									225.30
								</td>
							</tr>
							<tr
							  style="
                  border: 1px solid #171710;
                  text-align: center;
                  font-size: 14px;
                  padding: 2px 10px;
                "
              >
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									C
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
                >
									30,001 sehingga 200,000
								</td>
								<td
								  style="
                    border: 1px solid #171710;
                    text-align: center;
                    padding: 2px 10px;
                  "
								  colspan="3"
                >
									Berdasarkan Jumlah Dilindungi
								</td>
							</tr>
						</table>
					</div>
					<p
					  style="
              margin-block-start: 0px;
              margin-block-end: 8px;
              font-size: 14px;
              padding-left: 20px;
            "
          >
						Semua premium (jika terpakai) akan tertakluk kepada caj-caj atau
						cukai-cukai yang berkenaan, sebagaimana yang dianggap perlu oleh
						pihak berkuasa cukai Malaysia. Adalah penting untuk anda menyimpan
						apa-apa resit yang anda terima sebagai bukti pembayaran premium.
					</p>
					<p style="margin-block-end: 0px; font-size: 14px">
						<b>
							<span style="padding-right: 5px">4.</span> Apakah fi dan caj yang
							saya perlu bayar?
						</b>
					</p>
					<table
					  cellpadding="0"
					  cellspacing="0"
					  border="0"
					  style="padding-left: 20px; font-size: 14px; width: 65%"
          >
						<tr>
							<td
							  width="50%"
							  style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  border: 1px solid #171710;
                  text-align: center;
                  padding: 2px 10px;
                "
              >
								<b>Jenis</b>
							</td>
							<td
							  width="50%"
							  style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  border: 1px solid #171710;
                  text-align: center;
                  padding: 2px 10px;
                "
              >
								<b>Amaun</b>
							</td>
						</tr>

						<tr>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 2px 10px;
                "
              >
								Cukai Perkhidmatan
							</td>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 2px 10px;
                  text-align: center;
                "
              >
								8% daripada premium
							</td>
						</tr>

						<tr>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 2px 10px;
                "
              >
								Duti Setem
							</td>
							<td
							  style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 2px 10px;
                  text-align: center;
                "
              >
								RM10.00
							</td>
						</tr>
					</table>

					<div>
						<table>
							<tr style="height: 60px"></tr>
						</table>
						<table
						  style="empty-cells: show; width: 100%; border-collapse: collapse"
            >
							<tr>
								<td width="50%"></td>
								<td width="50%">
									<div
									  style="
                      display: flex;
                      justify-content: space-between;
                      font-size: 14px;
                    "
                  >
										<p style="text-align: left">1</p>
										<p style="text-align: right">
											PMG/EGIB/HH (LPPSA)/PDS/BM/2304V1.0
										</p>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div style="page-break-after: always"></div>
				<div style="height: 30px"></div>
				<div
				  style="
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          "
        >
					<div
					  style="
              padding-left: 40px;
              padding-right: 40px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.1499023;
              padding-top: 30px;
            "
          >
						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">5.</span> Apakah terma-terma
								dan syarat-syarat penting yang harus saya ambil perhatian?
							</b>
						</p>
						<span style="padding-left: 20px; font-size: 14px">
							<b>Kepentingan pendedahan</b>
						</span>
						<ol
						  type="a"
						  style="
                margin-block-start: 2px;
                padding-inline-start: 37px;
                margin-block-end: 8px;
                font-size: 14px;
              "
            >
							<li>
								Menurut Perenggan 5 daripada Jadual 9 Akta Perkhidmatan Kewangan
								2013, jika anda memohon insurans ini sepenuhnya untuk tujuan
								yang tidak berkaitan perdagangan, perniagaan atau profesion
								anda, anda mempunyai kewajipan untuk mengambil langkah yang
								munasabah untuk tidak salah nyata dalam menjawab soalan-soalan
								di dalam Borang Permohonan (atau semasa memohon insurans ini).
								Anda dikehendaki menjawab soalan-soalan dalam Borang ini dengan
								lengkap dan tepat.
							</li>
							<li>
								Kegagalan untuk mengambil langkah yang munasabah dalam menjawab
								soalan-soalan, mungkin mengakibatkan pembatalan kontrak insurans
								anda, keengganan atau pengurangan gantirugi, perubahan terma
								atau penamatan kontrak insurans anda.
							</li>
							<li>
								Kewajipan pendedahan diatas hendaklah diteruskan sehingga
								kontrak insurans anda dimeterai, diubah atau diperbaharui dengan
								kami.
							</li>
							<li>
								Sebagai tambahan kepada soalan-soalan di dalam Borang Permohonan
								(atau semasa memohon insurans ini), anda dikehendaki untuk
								mendedahkan apa-apa perkara lain yang anda tahu akan
								mempengaruhi keputusan kami dalam menerima risiko dan menentukan
								kadar dan terma yang dikenakan.
							</li>
							<li>
								Anda juga mempunyai kewajipan untuk memberitahu kami dengan
								serta-merta jika pada bila-bila masa selepas kontrak insurans
								anda ditandatangani, diubah atau diperbaharui dengan kami (atau
								semasa permohonan insurans ini), apa-apa maklumat yang
								dinyatakan dalam Borang Permohonan tidak tepat atau sudah
								berubah.
							</li>
						</ol>

						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Kandungan Isi Rumah</b> – Setiap barangan (tidak termasuk
							perabot, piano, organ, perkakas rumah, radio, set televisyen, set
							perakam video, hi-fi dan seumpamanya) hendaklah tidak melebihi 5%
							daripada jumlah yang dilindungi kecuali barang sedemikian telah
							secara khusus diisytiharkan sebagai butiran yang berasingan.
						</p>
						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Perlindungan Terhad</b> – Jumlah nilai platinum, emas dan
							perak, logam berharga dan batu, barang kemas, jam tangan dan bulu
							binatang hendaklah dianggap tidak melebihi satu pertiga (1/3)
							daripada jumlah perlindungan ke atas isi rumah.
						</p>
						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Nilai penuh isi rumah</b> – Jumlah perlindungan diisytiharkan
							oleh pihak yang diinsuranskan tidak boleh kurang daripada nilai
							penuh isi rumah yang diinsuranskan. Jumlah liabiliti berkenaan
							dengan kerugian atau kerosakan yang dalam mana-mana satu tempoh
							Insurans tidak boleh melebihi amaun yang dinyatakan terhadap
							setiap perkara masing-masing atau dalam agregat jumlah wang yang
							diinsuranskan yang dinyatakan dalam jadual.
						</p>
						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Tuntutan</b> – Jika berlaku kemalangan yang membawa kepada
							tuntutan, anda hendaklah memberitahu kami dalam masa 30 hari dari
							tarikh kemalangan itu berlaku.
						</p>
						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Nota:</b> Senarai ini adalah tidak menyeluruh. Sila rujuk
							kontrak polisi untuk melihat keseluruhan terma dan syarat.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">6.</span> Apakah
								pengecualian-pengecualian utama di bawah polisi ini?
							</b>
						</p>
						<span style="padding-left: 20px; font-size: 14px">
							Polisi ini tidak melindungi kerugian tertentu seperti:
						</span>
						<ol
						  type="a"
						  style="
                margin-block-start: 2px;
                padding-inline-start: 35px;
                margin-block-end: 8px;
                font-size: 14px;
              "
            >
							<li>
								Kerugian atau kerosakan disebabkan oleh peperangan atau risiko
								seumpamanya;
							</li>
							<li>
								Kerugian atau kerosakan disebabkan oleh pencemaran radioaktif,
								radiasi nuklear atau risiko seumpamanya;
							</li>
							<li>Jika rumah anda dibiarkan kosong lebih daripada 90 hari.</li>
						</ol>

						<p
						  style="
                margin-block-end: 0px;
                margin-block-start: 5px;
                padding-left: 20px;
                font-size: 14px;
              "
            >
							<b>Nota:</b>Senarai ini tidak menyeluruh. Sila rujuk kontrak
							polisi untuk senarai penuh pengecualian di bawah sijil ini
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">7.</span> Bolehkah saya
								membatalkan polisi saya?
							</b>
						</p>
						<p
						  style="
                padding-left: 20px;
                margin-block-end: 0px;
                margin-block-start: 0px;
                font-size: 14px;
              "
            >
							Anda boleh membatalkan polisi dengan memberi notis bertulis kepada
							kami. Selepas pembatalan, anda layak mendapat pemulangan
							sebahagian daripada premium dengan syarat anda tidak membuat
							sebarang tuntutan sepanjang tempoh insurans.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">8.</span> Apa yang patut saya
								buat sekiranya ada perubahan maklumat?
							</b>
						</p>
						<p
						  style="
                padding-left: 20px;
                margin-block-end: 0px;
                margin-block-start: 0px;
                font-size: 14px;
              "
            >
							Adalah penting untuk anda memaklumkan kepada kami tentang sebarang
							perubahan maklumat perhubungan bagi memastikan semua komunikasi
							sampai kepada anda tepat pada masanya.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right: 5px">9.</span> Di manakah saya boleh
								mendapatkan maklumat lanjut?
							</b>
						</p>
						<div
						  style="
                padding-left: 20px;
                margin-block-end: 0px;
                margin-block-start: 0px;
                font-size: 14px;
              "
            >
							<table
							  style="
                  empty-cells: show;
                  width: 100%;
                  border-collapse: collapse;
                "
              >
								<tr>
									<td width="50%" style="vertical-align: top; padding-top: 1px">
										<div style="font-size: 14px">
											<p>
												Sekiranya anda mempunyai sebarang pertanyaan, sila
												hubungi kami di:
											</p>
											<div>
												<strong
                          >Etiqa General Insurance Berhad (197001000276)</strong
                        >
											</div>
											<div>
												(Dilesenkan di bawah Akta Perkhidmatan Kewangan 2013 dan
												dikawalselia oleh Bank Negara Malaysia)
											</div>
											<div>Level 13, Tower B, Dataran Maybank</div>
											<div>No. 1, Jalan Maarof</div>
											<div>59000 Kuala Lumpur, Malaysia.</div>
											<div>Nombor Telefon: +603 2297 3888</div>
											<div>Nombor Faksimile: +603 2297 3800</div>
											<div>
												E-mel:
												<a href="mailto:info@etiqa.com.my">info@etiqa.com.my</a>
											</div>
											<div>
												Laman Web:
												<a href="http://www.etiqa.com.my" target="_blank"
                          >www.etiqa.com.my</a
                        >
											</div>
											<div>Etiqa Oneline: 1300 13 8888</div>
										</div>
									</td>
									<td width="50%" style="vertical-align: top">
										<div style="font-size: 14px">
											<p>Atau, anda boleh hubungi:</p>
											<div>LPPSA Officer</div>
											<div>Nama: Zuraini Mas Ayu</div>
											<div>E-mel: nonmotor.gta@etiqa.com.my</div>
											<div>Nombor Telefon: +603 8861 6772</div>
											<div>Nombor Faksimile: +603 8861 6782</div>
										</div>
									</td>
								</tr>
							</table>
						</div>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span>10.</span> Lain-lain jenis perlindungan seumpama yang
								boleh didapati
							</b>
						</p>

						<p
						  style="
                margin-block-start: 0px;
                margin-block-end: 8px;
                font-size: 14px;
                padding-left: 20px;
              "
            >
							Insurans Kebakaran.
						</p>

						<div style="padding-left: 20px">
							<table width="100%">
								<td
								  style="
                    border: 1.5px solid #171710;
                    padding: 2px 10px;
                    text-align: justify;
                    font-size: 14px;
                  "
                >
									<b>
										NOTA PENTING: <br />
										<xsl:choose>
											<xsl:when test="root/P_IsAgency = 'true'">
												ANDA PERLU MEMASTIKAN HARTA ANDA DILINDUNGI DENGAN NILAI
												YANG BERPATUTAN. ANDA HARUS BACA DAN FAHAMI KANDUNGAN
												KONTRAK POLISI DAN HUBUNGI KAMI UNTUK MAKLUMAT LANJUT.
											</xsl:when>
											<xsl:when test="root/P_IsAgency = 'false'">
												ANDA PERLU MEMASTIKAN HARTA ANDA DILINDUNGI DENGAN NILAI
												YANG BERPATUTAN. ANDA HARUS BACA DAN FAHAMI KANDUNGAN
												KONTRAK POLISI DAN HUBUNGI KAMI UNTUK MAKLUMAT LANJUT.
											</xsl:when>
										</xsl:choose>
									</b>
								</td>
							</table>
							<p
							  style="
                  margin-block-start: 0px;
                  margin-block-end: 0px;
                  font-size: 14px;
                "
              >
								Maklumat yang terkandung dalam helaian pendedahan ini adalah sah
								pada
								<xsl:value-of select="root/P_Date" />
							</p>
						</div>

						<div>
							<table>
								<tr style="height: 210px"></tr>
							</table>
							<table
							  style="
                  empty-cells: show;
                  width: 100%;
                  border-collapse: collapse;
                "
              >
								<tr>
									<td width="50%"></td>
									<td width="50%">
										<div
										  style="
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                      "
                    >
											<p style="text-align: left">2</p>
											<p style="text-align: right">
												PMG/EGIB/HH(LPPSA)/PDS/BM/2403V1.1
											</p>
										</div>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
