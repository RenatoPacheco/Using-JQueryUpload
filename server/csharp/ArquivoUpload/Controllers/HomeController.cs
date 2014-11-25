using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;

namespace ArquivoUpload.Controllers
{
    public class HomeController : Controller
    {
        public struct ImageInfo
        {
            public string Width { get; set; }
            public string Height { get; set; }

            public static ImageInfo File(string name)
            {
                ImageInfo resultado = new ImageInfo();
                try
                {
                    using (Image img = Image.FromFile(name))
                    {
                        Image thumb = img.GetThumbnailImage(img.Width / 10, img.Height / 10, () => false, IntPtr.Zero);
                        thumb.Save(Path.ChangeExtension(name, "png"));

                        resultado.Width = img.Width.ToString();
                        resultado.Height = img.Height.ToString();
                    }
                }
                catch
                {
                    resultado = new ImageInfo();
                }
                return resultado;
            }
        }

        public string Checksum(string name)
        {
            string resultado = string.Empty;
            try
            {
                using (var stream = System.IO.File.OpenRead(name))
                {
                    resultado = Checksum(stream);
                }
            }
            catch
            {
                resultado = string.Empty;
            }
            return resultado;
        }
        public string Checksum(Stream file)
        {
            string resultado = string.Empty;

            try
            {
                using (var md5 = MD5.Create())
                {
                    resultado = BitConverter.ToString(md5.ComputeHash(file)).Replace("-", String.Empty);
                }
            }
            catch
            {
                resultado = string.Empty;
            }

            return resultado;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Remove(string arquivos)
        {
            FileInfo info = new FileInfo(Server.MapPath("~/" + arquivos));
            if (info.Exists)
                info.Delete();

            var mensagem = new
            {
                @mensagem = "Arquivo removido com sucesso"
            };


            return Json(mensagem, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Upload()
        {
            var mensagem = new { files = new List<object>() };
            string checksum, checksumRequest;
            string urlAbsolute = Request.Url.Scheme + "://" + Request.Url.Host + ":" + Request.Url.Port;
            string local;
            string url;

            for (int i = 0; i < Request.Files.Count; i++)
            {
                local = Server.MapPath("~/Files/") + Request.Files[i].FileName;
                url = Url.Content("~/Files/") + Request.Files[i].FileName;
                checksumRequest = Checksum(Request.Files[i].InputStream);
                if (string.IsNullOrEmpty(checksumRequest))
                {
                    throw new Exception("O arquivo enviado está corrompido");
                }
                Request.Files[i].SaveAs(local);
                FileInfo info = new FileInfo(local);
                checksum = Checksum(local);

                if (checksumRequest != checksum)
                {
                    if (info.Exists) info.Delete();
                    throw new Exception("O arquivo gravado foi corrompido");
                }
                else if (!info.Exists)
                {
                    throw new Exception("Ocorreu um erro ao salvar o arquivo");
                }
                var img = ImageInfo.File(local);

                mensagem.files.Add(new
                {
                    @server = local,
                    @url = urlAbsolute + url,
                    @thumbnail_url = "",
                    @name = info.Name,
                    @contentType = Request.Files[i].ContentType,
                    @extension = info.Extension,
                    @size = Request.Files[i].ContentLength,
                    @width = img.Width,
                    @height = img.Height,
                    @checksum = checksum,
                    @delete_url = urlAbsolute + "/Home/Remove/?file=" + url,
                    @delete_type = "DELETE"
                });
            }

            return Json(mensagem, JsonRequestBehavior.AllowGet);
        }
    }
}
