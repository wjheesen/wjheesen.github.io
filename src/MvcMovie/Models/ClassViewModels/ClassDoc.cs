using Microsoft.AspNetCore.Html;
using System.Collections.Generic;
using System.Linq;

namespace MvcMovie.Models
{
    /// <summary>
    /// Class doc containing name, language, list of field groups, and list of method groups.
    /// </summary>
    public class ClassDoc
    {

        #region Fields

        /// <summary>
        /// The name of the class.
        /// </summary>
        private readonly string name;

        /// <summary>
        /// The language in which this class is written.
        /// </summary>
        private readonly string language;

        /// <summary>
        /// A list of this class' field doc groups.
        /// </summary>
        private readonly List<FieldDocGroup> fieldDocGroups = new List<FieldDocGroup>();

        /// <summary>
        /// A list of this class' method doc groups.
        /// </summary>
        private readonly List<MethodDocGroup> methodDocGroups = new List<MethodDocGroup>();

        #endregion

        #region Constructors

        /// <summary>
        /// Creates an empty class doc
        /// </summary>
        /// <param name="language">The language in which the class is written.</param>
        /// <param name="name">The name of the class.</param>
        public ClassDoc(string language, string name)
        {
            this.language = language;
            this.name = name;
        }

        #endregion

        #region Put Docs

        /// <summary>
        /// Adds a group of field docs to this class doc.
        /// </summary>
        public void PutFieldDocGroup(FieldDocGroup group)
        {
            this.fieldDocGroups.Add(group);
        }

        /// <summary>
        /// Adds a group of method docs to this class doc.
        /// </summary>
        public void PutMethodDocGroup(MethodDocGroup group)
        {
            this.methodDocGroups.Add(group);
        }

        #endregion

        #region ToString Methods

        public HtmlString ToHtmlString()
        {
            return new HtmlString($@"
{string.Join("\n", fieldDocGroups.Select((f) => f.toHtmlString(this.language, this.name)))}
{string.Join("\n", methodDocGroups.Select((g) => g.toHtmlString(this.language,this.name)))}
            ");
        }

        #endregion
    }

    /// <summary>
    /// Ordered list of method docs in a named group.
    /// </summary>
    public class MethodDocGroup : List<MethodDoc>
    {
        /// <summary>
        /// The name of this method group.
        /// </summary>
        private readonly string name;

        /// <summary>
        /// Creates an empty group of method docs.
        /// </summary>
        /// <param name="name">The name of the group.</param>
        public MethodDocGroup(string name)
        {
            this.name = name;
        }

        /// <summary>
        /// Outputs this method doc group as an html string.
        /// </summary>
        /// <param name="language">The name of the language in which this method group is written.</param>
        /// <param name="className">The name of the class that owns this method group.</param>
        public string toHtmlString(string language, string className)
        {
            //Extract html strings from method docs
            int order = 1;
            string groupName = this.name.ToLower().Replace(' ','-');
            var methodDocs = this.Select((m) => m.toHtmlString(language, className, groupName, order++));
            //Build html string and return 
            return $@"
<table class=""table"">
    <thead>
        <tr>
            <th colspan=""1"">
                <a href=""#{className}-{groupName}"" data-toggle=""collapse"">{this.name}</a>
            </th>
        </tr>
    </thead>
    <tbody id=""{className}-{groupName}"" class=""collapse"">
        {string.Join("\n", methodDocs)}
    </tbody>
</table>";
        }
    }

    /// <summary>
    /// Ordered list of field docs in a named group.
    /// </summary>
    public class FieldDocGroup : List<FieldDoc>
    {
        /// <summary>
        /// The name of this field group.
        /// </summary>
        private readonly string name;

        /// <summary>
        /// Creates an empty group of field docs.
        /// </summary>
        /// <param name="name">The name of the group.</param>
        public FieldDocGroup(string name)
        {
            this.name = name;
        }

        /// <summary>
        /// Outputs this field doc group as an html string.
        /// </summary>
        /// <param name="language">The name of the language in which this field group is written.</param>
        public string toHtmlString(string language, string className)
        {
            string groupName = this.name.ToLower().Replace(' ', '-');
            //Extract html strings from field docs
            var fieldDocs = this.Select((f) => f.ToHtmlString(language));
            //Build html string and return 
            return $@"
<table class=""table"">
    <thead>
        <tr>
            <th colspan=""1"">
                <a href=""#{className}-{groupName}"" data-toggle=""collapse"">{this.name}</a>
            </th>
        </tr>
    </thead>
    <tbody id=""{className}-{groupName}"" class=""collapse"">
        {string.Join("\n", fieldDocs)}
    </tbody>
</table>";
        }
    }

    /// <summary>
    /// Field doc containing description and signature of field.
    /// </summary>
    public class FieldDoc
    {
        #region Fields

        /// <summary>
        /// The field declaration.
        /// </summary>
        private string declaration;

        /// <summary>
        /// The field description.
        /// </summary>
        private string description;

        #endregion

        #region Constructors

        /// <summary>
        /// Constructs a field doc.
        /// </summary>
        /// <param name="description">The field description.</param>
        /// <param name="declaration">The field declaration.</param>
        public FieldDoc(string description, string declaration)
        {
            this.declaration = declaration;
            this.description = description;
        }

        #endregion

        #region ToString Methods

        public string ToHtmlString(string language)
        {
            return $@"
<tr>
    <td>
        <code class=""language-{language}"">{this.declaration}</code><br/>{this.description}
    </td>
</tr>
                ";
        }

        #endregion
    }

    /// <summary>
    /// Method doc containing description, signature, and body of method.
    /// </summary>
    public class MethodDoc
    {

        #region Fields

        /// <summary>
        /// The method signature.
        /// </summary>
        private readonly string signature;

        /// <summary>
        /// The method description.
        /// </summary>
        private readonly string description;

        /// <summary>
        /// The method body.
        /// </summary>
        private readonly string body;

        #endregion

        #region Constructors

        /// <summary>
        /// Creates a method doc.
        /// </summary>
        /// <param name="className">The name of the method.</param>
        /// <param name="order">The order of this method in the class.</param>
        /// <param name="description">The method description.</param>
        /// <param name="signature">The method signature.</param>
        /// <param name="body">The method body.</param>
        public MethodDoc(string description, string signature, string body)
        {
            this.description = description;
            this.signature = signature;
            this.body = body;
        }

        #endregion

        #region ToString Methods

        /// <summary>
        /// Outputs this method doc as an html string.
        /// </summary>
        /// <param name="language">The name of the language in which this method is written.</param>
        /// <param name="className">The name of the class that owns this method.</param>
        /// <param name="groupName">The name of the method group that owns this method.</param>
        /// <param name="order">The order of this method in its method group.</param>
        /// <returns></returns>
        public string toHtmlString(string language, string className, string groupName, int order)
        {
            return $@"
<tr>
    <td>
        <a href=""#{className}-{groupName}-{order}"" data-toggle=""collapse"">
            <code class=""language-{language}"">{this.signature}</code>
        </a>
        <p>{this.description}</p>
        <div id=""{className}-{groupName}-{order}"" class=""collapse"">
            <pre><code class=""language-{language}"">{this.body}</code></pre>
        </div>
    </td>
</tr>
            ";
        }

        #endregion

    }
}
